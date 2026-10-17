import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
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

async function GET(req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await authorize(req, res, ["ROLE_ADMIN", "ROLE_USER"]);
  if (Object.hasOwn(user, "status")) {
    return user;
  }
  const client = req.query.clientId;
  if (["ROLE_ADMIN"].includes(user.role)) {
    const whereFilter = typeof client === 'string' ? {clientId: client} : undefined;
    const collection = await prisma.pedido.findMany({
      where: whereFilter,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        client: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    return res.status(200).json(collection);
  }

  const collection = await prisma.pedido.findMany({
    where: {clientId: user.id},
    orderBy: {
      createdAt: 'desc'
    }
  })

  return res.status(200).json(collection);
}


async function POST(req: NextApiRequest,
res: NextApiResponse
) {
  const user = await authorize(req, res, ["ROLE_ADMIN", "ROLE_USER"]);
  if (Object.hasOwn(user, "status")) {
    return user;
  }
  try {
    const {
      status,
      valor,
    } = req.body

    if (!status ||!valor) {
      return res.status(400).json({
        message: 'Preencha os campos obrigatórios.',
      })
    }

    const pedido = await prisma.pedido.create({
        data: {
        status,
        valor,
        clientId: user.id
      }
    }
)

    return res.status(201).json(pedido)
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      message: 'Erro ao cadastrar pedido.',
    })
  }
}