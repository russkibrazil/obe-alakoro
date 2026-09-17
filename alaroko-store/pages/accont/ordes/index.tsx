import Link from 'next/link'
import { GetServerSideProps } from 'next'
import { prisma } from '@/lib/prisma'

type Order = {
  id: string
  status: string
  valor: number
  createdAt: string
}

type OrdersPageProps = {
  orders: Order[]
}

export default function OrdersPage({ orders }: OrdersPageProps) {
  function formatPrice(value: number) {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  function getStatusLabel(status: string) {
    const statuses: Record<string, string> = {
      PENDENTE: 'Pendente',
      PROCESSANDO: 'Processando',
      ENVIADO: 'Enviado',
      ENTREGUE: 'Entregue',
      CANCELADO: 'Cancelado',
    }

    return statuses[status] || status
  }

  function getStatusClass(status: string) {
    const classes: Record<string, string> = {
      PENDENTE: 'bg-yellow-100 text-yellow-700',
      PROCESSANDO: 'bg-blue-100 text-blue-700',
      ENVIADO: 'bg-purple-100 text-purple-700',
      ENTREGUE: 'bg-green-100 text-green-700',
      CANCELADO: 'bg-red-100 text-red-700',
    }

    return classes[status] || 'bg-gray-100 text-gray-700'
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link
            href="/account"
            className="text-sm text-purple-600 hover:underline"
          >
            ← Voltar para minha conta
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-gray-800">
            Meus pedidos
          </h1>

          <p className="mt-2 text-gray-600">
            Consulte o histórico e acompanhe seus pedidos.
          </p>
        </div>

        {orders.length === 0 ? (
          <section className="rounded-xl bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800">
              Você ainda não fez nenhum pedido
            </h2>

            <p className="mt-2 text-gray-600">
              Quando realizar uma compra, ela aparecerá aqui.
            </p>

            <Link
              href="/"
              className="mt-6 inline-block rounded-lg bg-purple-600 px-5 py-3 font-medium text-white transition hover:bg-purple-700"
            >
              Começar a comprar
            </Link>
          </section>
        ) : (
          <section className="overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-purple-50">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Pedido
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Data
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Valor
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Status
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">
                        #{order.id.slice(0, 8)}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(order.createdAt)}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-800">
                        {formatPrice(order.valor)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <Link
                          href={`/account/orders/${order.id}`}
                          className="text-sm font-medium text-purple-600 hover:underline"
                        >
                          Ver detalhes
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps<
  OrdersPageProps
> = async () => {
  // Substitua pelo ID obtido através do sistema de autenticação.
  const userId = 'cliente-id'

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      pedidos: {
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          status: true,
          valor: true,
          createdAt: true,
        },
      },
    },
  })

  const orders = (user?.pedidos || []).map((order) => ({
    ...order,
    createdAt: order.createdAt.toISOString(),
  }))

  return {
    props: {
      orders,
    },
  }
}