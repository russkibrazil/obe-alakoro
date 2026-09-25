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
    const categoria = await prisma.categoria.findUnique({
      where: { id },
      
    });

    if (!categoria) {
      return res.status(404).json(
        { message: 'categoria não encontrado' },
      );
    }

    return res.status(200).json(categoria);
  } catch (error) {
    return res.status(500).json(
      { message: 'Erro ao buscar o categoria' },
    );
  }
}

async function PATCH(req: NextApiRequest, res: NextApiResponse) {
  const id = typeof req.query.id === 'string' ? req.query.id : req.query.id?.at(0);
  try {
    const {
      name,
      slug,
    } = req.body

    const categoria = await prisma.categoria.update({
      where: {id},
      data: {
        name,
        slug }
        
    });

    return res.status(200).json(categoria);
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      message: 'Erro ao cadastrar categoria.',
    })
  }
}

async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  const id = typeof req.query.id === 'string' ? req.query.id : req.query.id?.at(0);
  try {
    const categoria = await prisma.categoria.delete({
      where: { id },
    });

    if (!categoria) {
      return res.status(404).json(
        { message: 'categoria não encontrado' },
      );
    }

    return res.status(204);
  } catch (error) {
    return res.status(500).json(
      { message: 'Erro ao buscar o categoria' },
    );
  }
}
