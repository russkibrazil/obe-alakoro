
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
    const { name } = req.body

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        message: 'O nome da categoria é obrigatório.',
      })
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
      },
    })

    return res.status(201).json(category)
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      message: 'Erro ao cadastrar categoria.',
    })
  }
}