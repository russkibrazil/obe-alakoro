import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../lib/prisma'
import { authorize } from '@/lib/auth/authorizeApi';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method ?? 'null';
  if ("GET" !== method) {
    return res.status(405).json({
      message: 'Método não permitido',
    })
  }
  const user = await authorize(req, res, ["ROLE_ADMIN", "ROLE_USER"]);
  if (Object.hasOwn(user, "status")) {
    return user;
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