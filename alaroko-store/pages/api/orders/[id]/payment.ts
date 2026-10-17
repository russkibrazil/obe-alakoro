import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'
import { authorize } from '@/lib/auth/authorizeApi';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method ?? 'null';
  if (!["GET", "POST"].includes(method)) {
    return res.status(405).json({
      message: 'Método não permitido',
    })
  }

  if (method === 'POST') {
    return POST(req, res);
  }
  
  return GET(req, res);
}

async function GET(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await authorize(req, res, ["ROLE_ADMIN", "ROLE_USER"]);
  if (Object.hasOwn(user, "status")) {
    return user;
  }
}

async function POST (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await authorize(req, res, ["ROLE_ADMIN", "ROLE_USER"]);
  if (Object.hasOwn(user, "status")) {
    return user;
  }
}