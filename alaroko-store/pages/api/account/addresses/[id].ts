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
  if (method === "PATCH") {
    return PATCH(req, res);
  }

  if (method === 'DELETE') {
    return DELETE(req, res);
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

  const id = typeof req.query.id === 'string' ? req.query.id : req.query.id?.at(0);
  
  const addr = await prisma.address.findFirst({
    where: {
      userId: user.id,
      id
    }
  });

  if (!addr) {
    return res.status(404).json({error: "Endereço não encontrado"});
  }

  return res.status(200).json(addr);
}

async function PATCH(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await authorize(req, res, ["ROLE_ADMIN", "ROLE_USER"]);
  if (Object.hasOwn(user, "status")) {
    return user;
  }

  const id = typeof req.query.id === 'string' ? req.query.id : req.query.id?.at(0);

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

  const a = await prisma.address.update({
    where: {id},
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
  return res.status(200).json(a);
}

async function DELETE(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await authorize(req, res, ["ROLE_ADMIN", "ROLE_USER"]);
  if (Object.hasOwn(user, "status")) {
    return user;
  }
  const id = typeof req.query.id === 'string' ? req.query.id : req.query.id?.at(0);

  const r = await prisma.address.delete({
    where: {
      id,
      userId: user.id
    }
  });
  if (!r) {
    return res.status(404).json({error: "Endereço não existe"});
  }
  return res.status(204).end();
}