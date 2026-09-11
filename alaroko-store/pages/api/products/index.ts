
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      message: 'Método não permitido',
    })
  }

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