import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'
import { authorize } from '@/lib/auth/authorizeApi';

interface CartSyncItem {
  productId: string;
  quantity: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'PUT') {
    return PUT(req, res)
  }

  res.setHeader('Allow', ['PUT'])
  return res.status(405).json({ message: 'Método não permitido.' })
}

async function PUT(req: NextApiRequest, res: NextApiResponse) {
  const user = await authorize(req, res, ["ROLE_ADMIN", "ROLE_USER"]);
  if (Object.hasOwn(user, "status")) {
    return user;
  }
  const userId = user.id;

  const body = req.body;
  const items: unknown = Array.isArray(body) ? body : body?.items;
  if (
    !Array.isArray(items) ||
    !items.every(
      (item): item is CartSyncItem =>
        item !== null &&
        typeof item === 'object' &&
        'productId' in item &&
        'quantity' in item &&
        typeof item.productId === 'string' &&
        item.productId.length > 0 &&
        Number.isInteger(item.quantity) &&
        item.quantity >= 1
    )
  ) {
    return res.status(400).json({ message: 'Itens de carrinho inválidos.' });
  }

  try {
    const synchronizedItems = await prisma.$transaction(async (transaction) => {
      const cart = await transaction.cart.upsert({
        where: { userId },
        create: { userId },
        update: {},
        include: { items: true },
      });
      const databaseItems = new Map(
        cart.items.map((item) => [item.productId, item])
      );

      for (const item of items) {
        const databaseItem = databaseItems.get(item.productId);
        if (!databaseItem) {
          const createdItem = await transaction.cartItem.create({
            data: {
              cartId: cart.id,
              productId: item.productId,
              quantity: item.quantity,
            },
          });
          databaseItems.set(item.productId, createdItem);
        } else if (databaseItem.quantity !== item.quantity) {
          const updatedItem = await transaction.cartItem.update({
            where: { id: databaseItem.id },
            data: { quantity: item.quantity },
          });
          databaseItems.set(item.productId, updatedItem);
        }
      }

      return transaction.cartItem.findMany({
        where: { cartId: cart.id },
        include: { product: true },
      });
    });

    return res.status(200).json(synchronizedItems);
  } catch (error) {
    console.error('Erro ao sincronizar carrinho do usuário:', error);
    return res.status(500).json({ error: 'Não foi possível sincronizar o carrinho do usuário' });
  }
}