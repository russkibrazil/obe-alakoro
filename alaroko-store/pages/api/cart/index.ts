import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    return GET(req, res)
  }

  if (req.method === 'POST') {
    return POST(req, res)
  }

  if (req.method === 'DELETE') {
    return DELETE(req, res)
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
  return res.status(405).json({ message: 'Método não permitido.' })
}

async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { cartId, userId } = req.query

  if (cartId !== undefined) {
    if (typeof cartId !== 'string' || !cartId.trim() || userId !== undefined) {
      return res.status(400).json({
        message: 'Informe apenas um cartId ou userId válido.',
      })
    }
  } else if (typeof userId !== 'string' || !userId.trim()) {
    return res.status(400).json({
      message: 'Informe apenas um cartId ou userId válido.',
    })
  }

  try {
    const include = {
      items: {
        include: {
          product: true,
        },
      },
    }
    const cart =
      typeof cartId === 'string'
        ? await prisma.cart.findUnique({ where: { id: cartId }, include })
        : typeof userId === 'string'
          ? await prisma.cart.findUnique({ where: { userId }, include })
          : null

    if (!cart) {
      return res.status(404).json({ message: 'Carrinho não encontrado.' })
    }

    return res.status(200).json(cart)
  } catch (error) {
    console.error('Erro ao buscar carrinho:', error)
    return res.status(500).json({ message: 'Erro ao buscar carrinho.' })
  }
}

async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { cartId, userId, productId, quantity } = req.body ?? {}

  if (
    (cartId !== undefined && (typeof cartId !== 'string' || !cartId.trim())) ||
    (userId !== undefined && (typeof userId !== 'string' || !userId.trim())) ||
    (cartId && userId)
  ) {
    return res.status(400).json({
      message: 'Informe um cartId ou userId válido, mas não ambos.',
    })
  }

  try {
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
      })

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado.' })
      }
    }

    if (!productId && userId) {
      const existingCart = await prisma.cart.findUnique({
        where: { userId },
      })
      const cart = await prisma.cart.upsert({
        where: { userId },
        create: { userId },
        update: {},
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      })

      return res.status(existingCart ? 200 : 201).json(cart)
    }

    if (
      typeof productId !== 'string' ||
      !productId.trim() ||
      (!cartId && !userId) ||
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      return res.status(400).json({
        message: 'Informe um carrinho, um produto e uma quantidade inteira positiva.',
      })
    }

    const cart = cartId
      ? await prisma.cart.findUnique({ where: { id: cartId } })
      : await prisma.cart.upsert({
          where: { userId },
          create: { userId },
          update: {},
        })

    if (!cart) {
      return res.status(404).json({ message: 'Carrinho não encontrado.' })
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    })

    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado.' })
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    })
    const item = await prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
      create: {
        cartId: cart.id,
        productId,
        quantity,
      },
      update: {
        quantity: { increment: quantity },
      },
      include: { product: true },
    })

    return res.status(existingItem ? 200 : 201).json(item)
  } catch (error) {
    console.error('Erro ao atualizar carrinho:', error)
    return res.status(500).json({ message: 'Erro ao atualizar carrinho.' })
  }
}

async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  const { itemId, cartId } = req.query

  if (
    typeof itemId !== 'string' ||
    !itemId.trim() ||
    (cartId !== undefined && typeof cartId !== 'string')
  ) {
    return res.status(400).json({ message: 'Informe um itemId válido.' })
  }

  try {
    const result = await prisma.cartItem.deleteMany({
      where: {
        id: itemId,
        ...(cartId ? { cartId } : {}),
      },
    })

    if (result.count === 0) {
      return res.status(404).json({ message: 'Item não encontrado no carrinho.' })
    }

    return res.status(200).json({ message: 'Item removido com sucesso.' })
  } catch (error) {
    console.error('Erro ao remover item do carrinho:', error)
    return res.status(500).json({ message: 'Erro ao remover item do carrinho.' })
  }
}
