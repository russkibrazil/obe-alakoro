import { authorize } from '@/lib/auth/authorizeApi';
import { prisma } from '../../../../lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    return POST(req, res);
  }
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const user = authorize(req, res, ["ROLE_ADMIN", "ROLE_USER"]);
  if (Object.hasOwn(user, "status")) {
    return user;
  }
  const items = await prisma.cartItem.findMany({
    where: {cart: {userId: 'asdsadsad'}}
  });

  if (items.length === 0) {
    return res.status(400).json({error: "Nnehum item a ser processado no carrinho"});
  }
  const cartId = items.at(0)?.cartId;

  const records:{productId:string; quantity: number; unitPrice:number;}[] = [];
  const newProductStock: Record<string, number> = {}

  for (const item of items) {
    const productData = await prisma.product.findUnique({
      where: {id: item.productId},
      select: {price: true, stock: true}
    });
    const currentProductStock = productData?.stock ?? 0;
    if (item.quantity > currentProductStock)
      return res.status(400).json({error: "O item não tem estoque suficiente", productId: item.productId});
    records.push({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: Number(productData?.price) ?? 0
    });
    newProductStock[item.productId] = currentProductStock - item.quantity
  }

  try {
    // 2. Transação: Cria o pedido, salva os itens e limpa o carrinho
    const order = await prisma.$transaction(async (tx) => {
      const totalAmount = records.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);

      const newOrder = await tx.pedido.create({
        data: {
          clientId: '#...',
          valor: totalAmount,
          status: 'PENDING',
          itens: {
            create: records,
          },
        },
      });

      // atualiza estoque
      for (const key in newProductStock) {
        const element = newProductStock[key];
        await tx.product.update({
          where: {id: key},
          data: {
            stock: element
          },
        });
      }

      // Esvazia os itens do carrinho após fechar o pedido
      await tx.cartItem.deleteMany({
        where: { cartId },
      });

      return newOrder;
    });

    return res.status(201).json({ message: 'Pedido realizado com sucesso', order });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao processar checkout' });
  }
}