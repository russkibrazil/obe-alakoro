import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      message: 'Método não permitido',
    })
  }

  return await prisma.user.findUnique({
    where: {id: ''},
    select: {pedidos: {
      select: {
        id: true,
        status: true,
        valor: true,
        createdAt: true,
      },
      take: 5,
      orderBy: {createdAt: 'desc'}
    }}
  })
}