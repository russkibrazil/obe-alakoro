
import Link from 'next/link'
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from 'next'
import { prisma } from '../../lib/prisma'

type Order = {
  id: string
  status: string
  valor: number
  createdAt: string
}

type AccountPageProps = {
  user: {
    name: string | null
    email: string
  }
  orders: Order[]
}

export const getServerSideProps: GetServerSideProps<
  AccountPageProps
> = async () => {
  // Substitua pelo ID do cliente autenticado.
  const userId = 'cliente-id'

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      name: true,
      email: true,
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

  if (!user) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      user: {
        name: user.name,
        email: user.email,
      },
      orders: user.pedidos.map((order) => ({
        id: order.id,
        status: order.status,
        valor: Number(order.valor),
        createdAt: order.createdAt.toISOString(),
      })),
    },
  }
}

export default function AccountPage({
  user,
  orders,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
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

  const recentOrders = orders.slice(0, 3)

  const activeOrders = orders.filter(
    (order) =>
      !['DELIVERED', 'CANCELED'].includes(order.status)
  )

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <p className="text-sm text-gray-500">
            Minha conta
          </p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            Olá, {user.name || 'cliente'}!
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Acompanhe suas compras e gerencie seus dados.
          </p>
        </header>

        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Total de pedidos
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {orders.length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Pedidos em andamento
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {activeOrders.length}
            </p>
          </div>
        </section>

        <section className="mb-8 rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 p-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Pedidos recentes
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Acompanhe suas últimas compras.
              </p>
            </div>

            <Link
              href="/account/orders"
              className="text-sm font-medium text-violet-600 hover:text-violet-800"
            >
              Ver todos
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">
                    Pedido
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    Data
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    Total
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    Status
                  </th>
                  <th className="px-5 py-4 text-right font-semibold">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-900">
                      #{order.id}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                      {formatDate(order.createdAt)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                      {formatPrice(order.valor)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColor(order.status)}`}
                      >
                        {formatStatus(order.status)}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <Link
                        href={`/account/orders/${order.id}`}
                        className="font-medium text-violet-600 hover:text-violet-800"
                      >
                        Ver detalhes
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {recentOrders.length === 0 && (
              <div className="p-10 text-center">
                <p className="text-sm text-gray-500">
                  Você ainda não realizou nenhum pedido.
                </p>

                <Link
                  href="/"
                  className="mt-3 inline-block text-sm font-medium text-violet-600 hover:text-violet-800"
                >
                  Começar a comprar
                </Link>
              </div>
            )}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            href="/account/orders"
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-violet-300 hover:shadow-md"
          >
            <h3 className="font-semibold text-gray-900">
              Meus pedidos
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Consulte o histórico e acompanhe suas compras.
            </p>
          </Link>

          <Link
            href="/account/profile"
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-violet-300 hover:shadow-md"
          >
            <h3 className="font-semibold text-gray-900">
              Dados pessoais
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Visualize e altere suas informações.
            </p>
          </Link>

          <Link
            href="/account/addresses"
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-violet-300 hover:shadow-md"
          >
            <h3 className="font-semibold text-gray-900">
              Meus endereços
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Gerencie seus endereços de entrega.
            </p>
          </Link>
        </section>
      </div>
    </main>
  )
}