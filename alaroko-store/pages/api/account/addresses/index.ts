import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'
import { authorize } from '@/lib/auth/authorizeApi'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method ?? 'null';

  if (method === "GET") {
    return GET(req, res);
  }
  if (method === "POST") {
    return POST(req, res);
  }

  return res.status(405).json({error: "Método não suportado"});
}

async function GET(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await authorize(req, res, ["ROLE_ADMIN", "ROLE_USER"]);
  if (Object.hasOwn(user, "status")) {
    return user;
  }

  const addr = await prisma.address.findMany({
    where: {userId: user.id}
  });

  return res.status(200).json(addr);
}

async function POST(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await authorize(req, res, ["ROLE_ADMIN", "ROLE_USER"]);
  if (Object.hasOwn(user, "status")) {
    return user;
  }

  const {
    label,
    recipientName,
    zipCode,
    street,
    complement,
    neighborhood,
    city,
    state,
    number
  } = req.body;

  if (!recipientName || !zipCode || !street || !number || !neighborhood || !city || !state ) {
    return res.status(400).json({error: "Preencha os campo obrigatórios"});
  }

  const a = await prisma.address.create({
    data: {
      label,
      recipientName,
      zipCode,
      street,
      complement,
      neighborhood,
      city,
      state,
      number,
      userId: user.id
    }
  });
  return res.status(201).json(a);
}