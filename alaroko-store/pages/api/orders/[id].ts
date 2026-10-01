import { prisma } from '../../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method ?? 'null';
  if (!["GET", "PATCH"].includes(method)) {
    return res.status(405).json({
      message: 'Método não permitido',
    });
  }

  if (method == "GET") {
    return GET(req, res);
  }
  if (method == "PATCH") {
    return PATCH(req, res);
  }

  return GET(req, res);
}

async function GET(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = typeof req.query.id === 'string' ? req.query.id : req.query.id?.at(0);
  try {
    const pedido= await prisma.pedido.findUnique({
      where: { id },
      
    });

    if (!pedido) {
      return res.status(404).json(
        { message: 'Produto não encontrado' },
      );
    }

    return res.status(200).json(pedido);
  } catch (error) {
    return res.status(500).json(
      { message: 'Erro ao buscar o produto' },
    );
  }
}

async function PATCH(req: NextApiRequest, res: NextApiResponse) {
  const id = typeof req.query.id === 'string' ? req.query.id : req.query.id?.at(0);
  try {
    const {
      status,
      valor
    } = req.body

    const pedido = await prisma.pedido.update({
      where: {id},
      data: {
      status,
      valor
      }
    });

    return res.status(200).json(pedido);
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      message: 'Erro ao cadastrar pedido.',
    })
  }
}
