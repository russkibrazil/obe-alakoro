import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { comparePassword } from '@/services/userHash';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method ?? 'null';
  if ("POST" !== method) {
    return res.status(405).json({
      message: 'Método não permitido',
    })
  }
  return POST(req, res);
}

async function POST(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    email,
    password
  } = req.body;

  if (!password || !email) {
    return res.status(400).json({
      message: 'Preencha os campos obrigatórios.',
    })
  }
  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
      select: {
        password: true,
        email: true,
        name: true,
        id: true,
      }
    })
    
    if (user === null) {
      return res.status(404).json({error: "Esta combinação de usuário e senha não existe"});
    }
    const hit = await comparePassword(password, user.password);

    if (!hit) {
      return res.status(404).json({error: "Esta combinação de usuário e senha não existe"});
    }

    return res.status(200).json({id:user.id, email: user.email, name: user.name})
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      message: 'Erro ao cadastrar produto.',
    })
  }
}