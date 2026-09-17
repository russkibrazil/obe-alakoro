import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { cartId, userId } = await request.json();

    if (!cartId) {
      return NextResponse.json({ error: 'Cart ID é obrigatório' }, { status: 400 });
    }

    // 1. Buscar o carrinho e os itens
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: { items: true },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: 'Carrinho vazio ou não encontrado' }, { status: 400 });
    }

    // 2. Transação: Cria o pedido, salva os itens e limpa o carrinho
    const order = await prisma.$transaction(async (tx) => {
      // Exemplo fixo de preço por produto; em produção, busque da tabela de Product
      const totalAmount = cart.items.reduce((acc, item) => acc + item.quantity * 50.0, 0);

      const newOrder = await tx.order.create({
        data: {
          userId: userId || cart.userId,
          total: totalAmount,
          status: 'PAID', // Simulando pagamento aprovado
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: 50.0,
            })),
          },
        },
        include: { items: true },
      });

      // Esvazia os itens do carrinho após fechar o pedido
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    return NextResponse.json({ message: 'Pedido realizado com sucesso', order }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao processar checkout' }, { status: 500 });
  }
}