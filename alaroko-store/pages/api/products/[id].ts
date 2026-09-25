import { prisma } from '../../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method ?? 'null';
  if (!["GET", "PATCH", "DELETE"].includes(method)) {
    return res.status(405).json({
      message: 'Método não permitido',
    });
  }

  if (method == "GET") {
    return GET(req, res);
  }
  if (method == "PATCH") {
    return PATCH(req, res);
  }
  if (method == 'DELETE') {
    return DELETE(req, res);
  }
  return GET(req, res);
}

async function GET(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = typeof req.query.id === 'string' ? req.query.id : req.query.id?.at(0);
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        categoria: {
          select: { name: true, slug: true },
        },
      },
    });

    if (!product) {
      return res.status(404).json(
        { message: 'Produto não encontrado' },
      );
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json(
      { message: 'Erro ao buscar o produto' },
    );
  }
}

async function PATCH(req: NextApiRequest, res: NextApiResponse) {
  const id = typeof req.query.id === 'string' ? req.query.id : req.query.id?.at(0);
  try {
    const {
      name,
      description,
      price,
      categoria,
      image
    } = req.body

    const product = await prisma.product.update({
      where: {id},
      data: {
        name,
        description,
        price,
        categoria,
        image
      }
    });

    return res.status(200).json(product);
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      message: 'Erro ao cadastrar produto.',
    })
  }
}

async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  const id = typeof req.query.id === 'string' ? req.query.id : req.query.id?.at(0);
  try {
    const product = await prisma.product.delete({
      where: { id },
    });

    if (!product) {
      return res.status(404).json(
        { message: 'Produto não encontrado' },
      );
    }

    return res.status(204);
  } catch (error) {
    return res.status(500).json(
      { message: 'Erro ao buscar o produto' },
    );
  }
}
