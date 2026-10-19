import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      message: 'Método não permitido',
    })
  }

  const categories = prisma.categoria.findMany({
    take: 6,
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { products: true },
      },
    },
  })

  return res.status(200).json(categories);
}