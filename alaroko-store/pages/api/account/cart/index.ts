import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'
import { authorize } from '@/lib/auth/authorizeApi';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    return GET(req, res)
  }

  if (req.method === "POST") {
    return POST(req, res);
  }

  // if (req.method === 'PATCH') {
  //   return PATCH(req, res)
  // }

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
  const user = authorize(req, res, ["ROLE_ADMIN", "ROLE_USER"]);
  if (Object.hasOwn(user, "status")) {
    return user;
  }
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

async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  const user = authorize(req, res, ["ROLE_ADMIN", "ROLE_USER"]);
  if (Object.hasOwn(user, "status")) {
    return user;
  }
  const selectedItem = req.query.item;
  if (typeof selectedItem === 'string') {
    try {
      const r = await prisma.cartItem.delete({
        where: { id: selectedItem}
      });
      return res.status(204);
    }
    catch {
      return res.status(404).json({error: "O item não existe"});
    }
  }
  try {
    await prisma.cartItem.deleteMany({
      where: { cart: {userId : 'asdasw'} },
    })

    return res.status(204);
  } catch (error) {
    console.error('Erro ao buscar carrinho:', error)
    return res.status(500).json({ message: 'Erro ao buscar carrinho.' })
  }
}

async function PATCH(req: NextApiRequest, res: NextApiResponse) {
  const user = authorize(req, res, ["ROLE_ADMIN", "ROLE_USER"]);
  if (Object.hasOwn(user, "status")) {
    return user;
  }

}

async function POST(req: NextApiRequest, res: NextApiResponse) {
  const user = authorize(req, res, ["ROLE_ADMIN", "ROLE_USER"]);
  if (Object.hasOwn(user, "status")) {
    return user;
  }
  const {
    productId,
    quantity
  } = req.body;

  if (!productId || !quantity) {
    return res.status(400).json({error: "Determine o item a ser adicionado"});
  }

  if (quantity < 1) {
    return res.status(400).json({error: "Quantidade insuficiente"});
  }
  const cartData = await prisma.cart.findUnique({
    where: {userId: 'asdasda'},
    select: {id: true}
  });
  try {
    await prisma.cartItem.create({
      data: {
        productId,
        quantity,
        cartId: cartData?.id ?? ""
      }
    })
    return res.status(201);
  } catch {
    return res.status(500).json({error: 'Não foi possível adicionar o item ao carrinho do usuário'});
  }
}