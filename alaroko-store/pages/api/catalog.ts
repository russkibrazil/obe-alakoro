import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const search = searchParams.get('q') || '';
  const categoryId = searchParams.get('category') || '';

  try {
    const products = await prisma.product.findMany({
      where: {
        AND: [
          categoryId ? { categoryId } : {},
          search
            ? {
                OR: [
                  { name: { contains: search, mode: 'insensitive' } },
                  { description: { contains: search, mode: 'insensitive' } },
                ],
              }
            : {},
        ],
      },
      include: {
        category: {
          select: { name: true, slug: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const categories = await prisma.category.findMany();

    return NextResponse.json({ products, categories });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar produtos' },
      { status: 500 }
    );
  }
}