import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    return GET(req, res)
  }

  if (req.method === 'PATCH') {
    return PATCH(req, res)
  }

  if (req.method === 'DELETE') {
    return DELETE(req, res)
  }

  res.setHeader('Allow', ['GET', 'PATCH', 'DELETE'])
  return res.status(405).json({ message: 'Método não permitido.' })
}

function getCartId(req: NextApiRequest) {
  const { id } = req.query
  return typeof id === 'string' && id.trim() ? id : undefined
}

async function GET(req: NextApiRequest, res: NextApiResponse) {
  const id = getCartId(req)

  if (!id) {
    return res.status(400).json({ message: 'Informe um ID de carrinho válido.' })
  }

  try {
    const cart = await prisma.cart.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!cart) {
      return res.status(404).json({ message: 'Carrinho não encontrado.' })
    }

    return res.status(200).json(cart)
  } catch (error) {
    console.error('Erro ao buscar carrinho:', error)
    return res.status(500).json({ message: 'Erro ao buscar carrinho.' })
  }
}

async function PATCH(req: NextApiRequest, res: NextApiResponse) {
  const cartId = getCartId(req)
  const { itemId, productId, quantity } = req.body ?? {}

  if (!cartId) {
    return res.status(400).json({ message: 'Informe um ID de carrinho válido.' })
  }

  if (
    (itemId !== undefined && (typeof itemId !== 'string' || !itemId.trim())) ||
    (productId !== undefined &&
      (typeof productId !== 'string' || !productId.trim())) ||
    Boolean(itemId) === Boolean(productId) ||
    !Number.isInteger(quantity) ||
    quantity <= 0
  ) {
    return res.status(400).json({
      message: 'Informe itemId ou productId e uma quantidade inteira positiva.',
    })
  }

  try {
    const item = await prisma.cartItem.findFirst({
      where: itemId
        ? { id: itemId, cartId }
        : { cartId, productId },
    })

    if (!item) {
      return res.status(404).json({ message: 'Item não encontrado no carrinho.' })
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity },
      include: { product: true },
    })

    return res.status(200).json(updatedItem)
  } catch (error) {
    console.error('Erro ao atualizar item do carrinho:', error)
    return res.status(500).json({ message: 'Erro ao atualizar item do carrinho.' })
  }
}

async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  const id = getCartId(req)

  if (!id) {
    return res.status(400).json({ message: 'Informe um ID de carrinho válido.' })
  }

  try {
    const result = await prisma.cart.deleteMany({
      where: { id },
    })

    if (result.count === 0) {
      return res.status(404).json({ message: 'Carrinho não encontrado.' })
    }

    return res.status(200).json({ message: 'Carrinho removido com sucesso.' })
  } catch (error) {
    console.error('Erro ao remover carrinho:', error)
    return res.status(500).json({ message: 'Erro ao remover carrinho.' })
  }
}
