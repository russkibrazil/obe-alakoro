import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Buscar o carrinho
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cartId = searchParams.get('cartId');

  if (!cartId) {
    return NextResponse.json({ error: 'Cart ID é obrigatório' }, { status: 400 });
  }

  try {
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: true,
      },
    });

    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar carrinho' }, { status: 500 });
  }
}

// Adicionar ou atualizar item no carrinho
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cartId, productId, quantity } = body;

    if (!cartId || !productId || !quantity) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    // Verifica se o item já existe no carrinho
    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId, productId },
    });

    if (existingItem) {
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
      return NextResponse.json(updatedItem);
    }

    const newItem = await prisma.cartItem.create({
      data: {
        cartId,
        productId,
        quantity,
      },
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar carrinho' }, { status: 500 });
  }
}

// Remover item do carrinho
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID é obrigatório' }, { status: 400 });
    }

    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json({ message: 'Item removido com sucesso' });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao remover item' }, { status: 500 });
  }
}