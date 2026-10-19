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

  const products = await prisma.product.findMany({
    where: {
      active: true,
    },
    take: 8,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      categoria: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  })

  return res.status(200).json(products);
}