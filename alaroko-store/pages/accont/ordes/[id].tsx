import Link from 'next/link'
import { GetServerSideProps } from 'next'
import { prisma } from '@/lib/prisma'

type Order = {
  id: string
  status: string
  valor: number
  createdAt: string
  pagamento: {
    metodo: string
    status: string
  } | null
  entrega: {
    endereco: string
    cidade: string
  } | null
}

type OrderPageProps = {
  order: Order | null
}

export default function OrderDetailsPage({
  order,
}: OrderPageProps) {
  function formatPrice(value: number) {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
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

  if (!order) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/account/orders"
            className="text-sm text-purple-600 hover:underline"
          >
            ← Voltar para meus pedidos
          </Link>

          <section className="mt-6 rounded-xl bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-gray-800">
              Pedido não encontrado
            </h1>

            <p className="mt-2 text-gray-600">
              Não foi possível encontrar os detalhes desse pedido.
            </p>
          </section>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/account/orders"
          className="text-sm text-purple-600 hover:underline"
        >
          ← Voltar para meus pedidos
        </Link>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Pedido #{order.id.slice(0, 8)}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Realizado em {formatDate(order.createdAt)}
            </p>
          </div>

          <span
            className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${getStatusClass(
              order.status
            )}`}
          >
            {getStatusLabel(order.status)}
          </span>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <section className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800">
              Resumo do pedido
            </h2>

            <div className="mt-5 space-y-4">
              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-600">
                  Número do pedido
                </span>

                <span className="font-medium text-gray-800">
                  #{order.id.slice(0, 8)}
                </span>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-600">
                  Data
                </span>

                <span className="font-medium text-gray-800">
                  {formatDate(order.createdAt)}
                </span>
              </div>

              <div className="flex justify-between pt-1">
                <span className="text-gray-600">
                  Total
                </span>

                <span className="text-lg font-bold text-purple-700">
                  {formatPrice(order.valor)}
                </span>
              </div>
            </div>
          </section>

          <section className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800">
              Pagamento
            </h2>

            {order.pagamento ? (
              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-sm text-gray-500">
                    Método de pagamento
                  </p>

                  <p className="mt-1 font-medium text-gray-800">
                    {order.pagamento.metodo}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Status
                  </p>

                  <p className="mt-1 font-medium text-gray-800">
                    {order.pagamento.status}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-5 text-gray-500">
                Informações de pagamento não disponíveis.
              </p>
            )}
          </section>
        </div>

        <section className="mt-6 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">
            Entrega
          </h2>

          {order.entrega ? (
            <div className="mt-5">
              <p className="text-sm text-gray-500">
                Endereço de entrega
              </p>

              <p className="mt-1 font-medium text-gray-800">
                {order.entrega.endereco}
              </p>

              <p className="mt-1 text-gray-600">
                {order.entrega.cidade}
              </p>
            </div>
          ) : (
            <p className="mt-5 text-gray-500">
              Informações de entrega não disponíveis.
            </p>
          )}
        </section>

        <div className="mt-8">
          <Link
            href="/account/orders"
            className="inline-block rounded-lg border border-purple-600 px-5 py-3 font-medium text-purple-600 transition hover:bg-purple-50"
          >
            Voltar para meus pedidos
          </Link>
        </div>
      </div>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps<
  OrderPageProps
> = async (context) => {
  const { id } = context.params as { id: string }

  // Substitua pelo ID obtido através do sistema de autenticação.
  const userId = 'cliente-id'

  const order = await prisma.pedido.findFirst({
    where: {
      id,
      clientId: userId,
    },
    select: {
      id: true,
      status: true,
      valor: true,
      createdAt: true,

      pagamento: {
        select: {
          metodo: true,
          status: true,
        },
      },

      entrega: {
        select: {
          endereco: true,
          cidade: true,
        },
      },
    },
  })

  if (!order) {
    return {
      props: {
        order: null,
      },
    }
  }

  return {
    props: {
      order: {
        ...order,
        createdAt: order.createdAt.toISOString(),
      },
    },
  }
}