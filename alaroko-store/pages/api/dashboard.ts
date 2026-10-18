import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../lib/prisma'
import { authorize } from '@/lib/auth/authorizeApi';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method ?? 'null';
  if ("GET" !== method) {
    return res.status(405).json({
      message: 'Método não permitido',
    })
  }
  const user = await authorize(req, res, ["ROLE_ADMIN"]);
  if (Object.hasOwn(user, "status")) {
    return user;
  }

  const LOW_STOCK_THRESHOLD = 5;

  const [
    totalOrders,
    pendingOrders,
    totalProducts,
    lowStockProducts,
    recentOrders,
    approvedPayments,
    lowStockCount,
    paidOrders,
  ] = await Promise.all([
    prisma.pedido.count(),

    prisma.pedido.count({
      where: {
        status: "PENDING",
      },
    }),

    prisma.product.count(),

    prisma.product.findMany({
      where: {
        active: true,
        stock: {
          lte: LOW_STOCK_THRESHOLD,
        },
      },
      select: {
        id: true,
        name: true,
        stock: true,
        sku: true,
      },
      orderBy: {
        stock: "asc",
      },
      take: 5,
    }),

    prisma.pedido.findMany({
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        pagamento: {
          select: {
            status: true,
          },
        },
      },
    }),

    prisma.pagamento.aggregate({
      where: {
        status: "APROVADO",
      },
      _sum: {
        valor: true,
      },
    }),

    prisma.product.count({
      where: {
        active: true,
        stock: {
          lte: LOW_STOCK_THRESHOLD,
        },
      },
    }),

    prisma.pedido.count({
      where: {
        pagamento: {
          is: {
            status: "APROVADO",
          },
        },
      },
    }),
  ]);

  const totalRevenue = Number(
    approvedPayments._sum.valor ?? 0
  );

  const averageOrderValue =
  paidOrders > 0
    ? totalRevenue / paidOrders
    : 0;

  return res.status(200).json({
    "stats": {  
      totalOrders,
      pendingOrders,
      totalProducts,
      "lowStockProducts": lowStockCount,
      totalRevenue,
      averageOrderValue
    },
    "recentOrders": recentOrders,
    "lowStockProducts": lowStockProducts
  })
}