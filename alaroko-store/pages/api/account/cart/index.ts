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

  if (req.method === 'PUT') {
    return PUT(req, res)
  }

  if (req.method === 'DELETE') {
    return DELETE(req, res)
  }

  res.setHeader('Allow', ['GET', 'PUT', 'POST', 'DELETE'])
  return res.status(405).json({ message: 'Método não permitido.' })
}

async function GET(req: NextApiRequest, res: NextApiResponse) {
  const user = await authorize(req, res, ["ROLE_ADMIN", "ROLE_USER"]);
  if (Object.hasOwn(user, "status")) {
    return user;
  }

  try {
    const cart = await prisma.cart.findFirst({
      where: { userId: user.id },
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

    return res.status(200).json(cart.items)
  } catch (error) {
    console.error('Erro ao buscar carrinho:', error)
    return res.status(500).json({ message: 'Erro ao buscar carrinho.' })
  }
}

async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  const user = await authorize(req, res, ["ROLE_ADMIN", "ROLE_USER"]);
  if (Object.hasOwn(user, "status")) {
    return user;
  }
  const selectedItem = typeof req.query.selectedItem === 'string' ? req.query.selectedItem : req.query.selectedItem?.at(0);
  if (typeof selectedItem === 'string') {
    const r = await prisma.cartItem.deleteMany({
      where: {AND: [
        {productId: selectedItem},
        {cart: {userId: user.id}}
      ]
      }
    });
    if (r.count === 0) {
      return res.status(404).json({error: "O item não existe"});
    }
    return res.status(204).end();
  }
  try {
    await prisma.cartItem.deleteMany({
      where: { cart: {userId : user.id} },
    })

    return res.status(204).end();
  } catch (error) {
    console.error('Erro ao buscar carrinho:', error)
    return res.status(500).json({ message: 'Erro ao buscar carrinho.' })
  }
}

async function PUT(req: NextApiRequest, res: NextApiResponse) {
  const user = await authorize(req, res, ["ROLE_ADMIN", "ROLE_USER"]);
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

  let cartData = await prisma.cart.findUnique({
    where: {userId: user.id},
    select: {
      id: true,
      items: true
    }
  });

  if (cartData == null) {
    cartData = await prisma.cart.create({
      data:{ 
        userId: user.id
      },
      select: {id: true,
        items: true
      }
    })
  }

  const prod = cartData.items.find(el => el.productId === productId);
  let cartItem = undefined;
  if (!prod) {
    await prisma.cartItem.create({
      data:{
        productId: productId,
        quantity: quantity,
        cartId: cartData.id
      }
    })
  } else {
    await prisma.cartItem.update({
      where: {id: prod.id},
      data: {
        quantity: quantity
      }
    })
  }

  return cartItem;
}

async function POST(req: NextApiRequest, res: NextApiResponse) {
  const user = await authorize(req, res, ["ROLE_ADMIN", "ROLE_USER"]);
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
  let cartData = await prisma.cart.findUnique({
    where: {userId: user.id},
    select: {id: true}
  });

  if (cartData == null) {
    cartData = await prisma.cart.create({
      data:{ 
        userId: user.id
      }
    })
  }

  try {
    const ci = await prisma.cartItem.create({
      data: {
        productId,
        quantity,
        cartId: cartData?.id ?? ""
      }
    })
    return res.status(201).json(ci);
  } catch {
    return res.status(500).json({error: 'Não foi possível adicionar o item ao carrinho do usuário'});
  }
}