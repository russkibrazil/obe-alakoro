import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { hashPassword } from '@/services/userHash';

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
    name,
    cpf,
    phone,
    password
  } = req.body;

  if (!password || !name || !email || !cpf || !phone) {
    return res.status(400).json({
      message: 'Preencha os campos obrigatórios.',
    })
  }
  const hashedPassword = await hashPassword(password);
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        cpf,
        phone,
        password: hashedPassword,
        roles: "ROLE_USER"
      },
    });

    return res.status(201).json({id:user.id, email: user.email, name: user.name});
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      message: 'Erro ao cadastrar produto.',
    })
  }
}