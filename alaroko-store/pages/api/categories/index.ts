
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  async function GET(req: NextApiRequest,
  res: NextApiResponse
) {
  const collection = await prisma.categoria.findMany();
  return res.status(200).json(collection);
}
}

async function POST(req: NextApiRequest,
res: NextApiResponse
) {
  try {
    const {
      name,
      slug
    } = req.body

    if (!name || !slug) {
      return res.status(400).json({
        message: 'Preencha os campos obrigatórios.',
      })
    }

    const categoria = await prisma.categoria.create({
      data: {
        name,
        slug
      },
    })

    return res.status(201).json(categoria)
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      message: 'Erro ao cadastrar produto.',
    })
  }
}
