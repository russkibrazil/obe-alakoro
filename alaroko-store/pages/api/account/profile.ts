import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { authorize } from '@/lib/auth/authorizeApi'

type ResponseData = {
  message: string
  user?: {
    id: string
    name: string | null
    email: string
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method ?? 'null';

  if (method === 'GET') {
    return GET(req, res);
  }

  if (method === 'PUT') {
    return PUT(req, res);
  }

  res.setHeader('Allow', ["GET", 'PUT'])

  return res.status(405).json({
    message: 'Método não permitido.',
  })
}

async function GET(req: NextApiRequest,
  res: NextApiResponse) {
  const user = await authorize(req, res, ["ROLE_ADMIN", "ROLE_USER"]);
  if (Object.hasOwn(user, "status")) {
    return user;
  }
  const u = await prisma.user.findUnique({
    where: {id: user.id}
  });

  if (u == null) {
    return res.status(404).json({error: "Usuário não existe"});
  }
  return res.status(200).json(u);
}

async function PUT(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await authorize(req, res, ["ROLE_ADMIN", "ROLE_USER"]);
  if (Object.hasOwn(user, "status")) {
    return user;
  }

  try {
    const { name, email } = req.body

    if (!name || typeof name !== 'string') {
      return res.status(400).json({
        message: 'O nome é obrigatório.',
      })
    }

    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        message: 'O e-mail é obrigatório.',
      })
    }

    const normalizedName = name.trim()
    const normalizedEmail = email.trim().toLowerCase()

    if (normalizedName.length < 2) {
      return res.status(400).json({
        message: 'Digite um nome válido.',
      })
    }

    if (!normalizedEmail.includes('@')) {
      return res.status(400).json({
        message: 'Digite um e-mail válido.',
      })
    }

    // Substitua pelo ID obtido através do sistema de autenticação.
    const userId = 'cliente-id'

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user) {
      return res.status(404).json({
        message: 'Usuário não encontrado.',
      })
    }

    const emailAlreadyExists = await prisma.user.findFirst({
      where: {
        email: normalizedEmail,
        NOT: {
          id: userId,
        },
      },
    })

    if (emailAlreadyExists) {
      return res.status(409).json({
        message: 'Este e-mail já está sendo utilizado.',
      })
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: normalizedName,
        email: normalizedEmail,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    return res.status(200).json({
      message: 'Perfil atualizado com sucesso.',
      user: updatedUser,
    })
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error)

    return res.status(500).json({
      message: 'Erro interno ao atualizar o perfil.',
    })
  }
}