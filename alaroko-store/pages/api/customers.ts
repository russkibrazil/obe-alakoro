import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../lib/prisma'

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
  return await prisma.user.findMany({
    where: {
      pedidos: {some: {}}
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      _count: {
        select: {
          pedidos: true,
        },
      },
    },
  })
}