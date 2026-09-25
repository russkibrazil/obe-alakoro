
import Link from 'next/link'
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from 'next'
import { useMemo, useState } from 'react'
import { prisma } from '../../../lib/prisma'

type Order = {
  id: string
  total: number
  status: string
  createdAt: string
  user: {
    name: string
    email: string
  } | null
}

type OrdersPageProps = {
  orders: Order[]
}

export const getServerSideProps: GetServerSideProps<
  OrdersPageProps
> = async () => {
  const orders = await prisma.pedido.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  })

  return {
    props: {
      orders: orders.map((order) => ({
        id: String(order.id),
        total: Number(order.total),
        status: order.status,
        createdAt: order.createdAt.toISOString(),
        user: order.user,
      })),
    },
  }
}

export default function OrdersPage({
  orders,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.user?.name.toLowerCase().includes(search.toLowerCase()) ||
        order.user?.email.toLowerCase().includes(search.toLowerCase())

      const matchesStatus =
        status === 'all' || order.status === status

      return matchesSearch && matchesStatus
    })
  }, [orders, search, status])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  const formatStatus = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: 'Pendente',
      PAID: 'Pago',
      PROCESSING: 'Em processamento',
      SHIPPED: 'Enviado',
      DELIVERED: 'Entregue',
      CANCELED: 'Cancelado',
    }

    return labels[status] ?? status
  }

  const statusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-700',
      PAID: 'bg-blue-100 text-blue-700',
      PROCESSING: 'bg-purple-100 text-purple-700',
      SHIPPED: 'bg-indigo-100 text-indigo-700',
      DELIVERED: 'bg-green-100 text-green-700',
      CANCELED: 'bg-red-100 text-red-700',
    }

    return colors[status] ?? 'bg-gray-100 text-gray-700'
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Gestão de pedidos
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Acompanhe os pedidos realizados na loja.
          </p>
        </header>

        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 p-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Pedidos cadastrados
              </h2>

              <p className="text-sm text-gray-500">
                {filteredOrders.length} pedido(s) encontrado(s)
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <input
                type="search"
                placeholder="Buscar pedido ou cliente..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-violet-500"
              >
                <option value="all">Todos os status</option>
                <option value="PENDING">Pendente</option>
                <option value="PAID">Pago</option>
                <option value="PROCESSING">Em processamento</option>
                <option value="SHIPPED">Enviado</option>
                <option value="DELIVERED">Entregue</option>
                <option value="CANCELED">Cancelado</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">
                    Pedido
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    Cliente
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    Total
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    Status
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    Data
                  </th>
                  <th className="px-5 py-4 text-right font-semibold">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-900">
                      #{order.id}
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">
                        {order.user?.name ?? 'Cliente não informado'}
                      </p>

                      <p className="text-xs text-gray-500">
                        {order.user?.email ?? 'Sem e-mail'}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                      {formatPrice(order.total)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColor(order.status)}`}
                      >
                        {formatStatus(order.status)}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                      {formatDate(order.createdAt)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <Link
                        href={`/adm/orders/${order.id}`}
                        className="font-medium text-violet-600 hover:text-violet-800"
                      >
                        Ver detalhes
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredOrders.length === 0 && (
              <div className="p-10 text-center text-sm text-gray-500">
                Nenhum pedido encontrado.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}