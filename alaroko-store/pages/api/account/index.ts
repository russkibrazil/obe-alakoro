import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { authorize } from '@/lib/auth/authorizeApi';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      message: 'Método não permitido',
    })
  }

  const user = authorize(req, res, ["ROLE_ADMIN", "ROLE_USER"]);
  if (Object.hasOwn(user, "status")) {
    return user;
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