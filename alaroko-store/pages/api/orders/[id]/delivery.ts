import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'
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

async function GET(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await authorize(req, res, ["ROLE_ADMIN", "ROLE_USER"]);
  if (Object.hasOwn(user, "status")) {
    return user;
  }
  const orderId = req.query.id;
  if (typeof orderId !== 'string') {
    return res.status(400).json({error: "Pedido inválido"});
  }
  const deliveryDetails = await prisma.entrega.findFirst({
    where: {pedidoId: orderId}
  });

  if (deliveryDetails == null) {
    return res.status(404).json({error: "Não há entregas para este pedido"});
  }

  return res.status(200).json(deliveryDetails);
}

async function POST (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await authorize(req, res, ["ROLE_ADMIN", "ROLE_USER"]);
  if (Object.hasOwn(user, "status")) {
    return user;
  }
  const {
    endereco,
    numero,
    complemento,
    bairro,
    cidade,
    estado,
    cep
  } = req.body;

  if (!endereco || !numero || !bairro || !cidade || !estado || !cep) {
    return res.status(400).json({error: "Preencha os campos obrigatórios"});
  }
  const orderId = req.query.id;
  if (typeof orderId !== 'string') {
    return res.status(400).json({error: "Pedido inválido"});
  }
  try {
    const data = await prisma.entrega.create({
      data: {
        endereco,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        cep,
        valorFrete: 0.0,
        pedidoId: orderId
      }
    })
    return res.status(201).json(data);
  } catch (error) {
    return res.status(400).json({error: "O pedido já tem datalhes de frete agragados"});
  }
}