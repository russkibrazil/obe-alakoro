
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { authorize } from '@/lib/auth/authorizeApi';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method ?? 'null';
  if (!["GET", "POST"].includes(method)) {
    return res.status(405).json({
      message: 'Método não permitido',
    })
  }

  if (method === 'POST') {
    return POST(req, res);
  }
  
  return GET(req, res);
}

async function GET(req: NextApiRequest,
  res: NextApiResponse
) {
  const {categoriaId, name} = req.query;
  const catFilterQuery = typeof categoriaId === 'string' ? {categoriaId: categoriaId} : undefined;
  const keywordFilterQuery = typeof name === 'string' ? {OR:[{ name: { contains: name } }, { description: { contains: name } },]} : undefined
  const collection = await prisma.product.findMany(buildFilter(catFilterQuery, keywordFilterQuery));
  return res.status(200).json(collection);
}

function buildFilter(categoryFilter, keywordFilter) {
  if (!categoryFilter && !keywordFilter) {
    return {}
  }
  if (categoryFilter && keywordFilter) {
    return {
      where: {
        AND: [categoryFilter, keywordFilter]
      }
    }
  }
  if (categoryFilter) {
    return {where: categoryFilter};
  }
  if (keywordFilter) {
    return {
      where: keywordFilter
    }
  }
}


async function POST(req: NextApiRequest,
res: NextApiResponse
) {
  const user = authorize(req, res, ["ROLE_ADMIN"]);
  if (Object.hasOwn(user, "status")) {
    return user;
  }
  try {
    const {
      name,
      description,
      price,
      stock,
      categoriaId,
      image,
    } = req.body

    if (!name || price === undefined || stock === undefined) {
      return res.status(400).json({
        message: 'Preencha os campos obrigatórios.',
      })
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        categoriaId,
        image,
      },
    })

    return res.status(201).json(product)
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      message: 'Erro ao cadastrar produto.',
    })
  }
}