
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

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
  const collection = await prisma.product.findMany();
  return res.status(200).json(collection);
}


async function POST(req: NextApiRequest,
res: NextApiResponse
) {
  try {
    const {
      name,
      description,
      price,
      stock,
      category,
      image,
    } = req.body

    if (!name || price === undefined || stock === undefined) {
      return res.status(400).json({
        message: 'Preencha os campos obrigatórios.',
      })
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        category,
        image,
      },
    })

    return res.status(201).json(product)
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      message: 'Erro ao cadastrar produto.',
    })
  }
}