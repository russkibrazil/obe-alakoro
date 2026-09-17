import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

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
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT'])

    return res.status(405).json({
      message: 'Método não permitido.',
    })
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