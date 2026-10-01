import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {}

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
        categoria: {
          select: { name: true, slug: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const categories = await prisma.categoria.findMany();

    return NextResponse.json({ products, categories });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar produtos' },
      { status: 500 }
    );
  }
}