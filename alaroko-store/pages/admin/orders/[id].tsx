import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { OrderStatus, MetodoPagamento, StatusEntrega, StatusPagamento } from '@/generated/prisma/enums';
import { Entrega, Pagamento } from '@/generated/prisma/client';
import { withAuthorization } from '@/components/withAuthorization';

type OrderItem = {
  id: string;
  quantidade: number;
  preco: string;
  unitPrice: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    sku?: string | null;
    image?: string | null;
  };
};

type Order = {
  id: string;
  status: OrderStatus;
  valor: string;
  createdAt: string;
  updatedAt: string;
  clientId: string;
  client: {
    id: string;
    name?: string;
    email?: string;
  };
  itens: OrderItem[];
  pagamento?: Pagamento | null;
  entrega?: Entrega | null;
};

const orderStatusLabels: Record<OrderStatus, string> = {
  PENDING: 'Pendente',
  CONFIRMED: 'Confirmado',
  PROCESSING: 'Em preparação',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregue',
  CANCELED: 'Cancelado',
  REFUNDED: 'Estornado',
};

const paymentMethodLabels: Record<MetodoPagamento, string> = {
  PIX: 'PIX',
  CARTAO_CREDITO: 'Cartão de crédito',
  CARTAO_DEBITO: 'Cartão de débito',
  BOLETO: 'Boleto',
};

const paymentStatusLabels: Record<StatusPagamento, string> = {
  PENDENTE: 'Pendente',
  PROCESSANDO: 'Processando',
  APROVADO: 'Aprovado',
  RECUSADO: 'Recusado',
  CANCELADO: 'Cancelado',
  ESTORNADO: 'Estornado',
};

const deliveryStatusLabels: Record<StatusEntrega, string> = {
  PENDENTE: 'Pendente',
  PREPARANDO: 'Preparando',
  ENVIADO: 'Enviado',
  EM_TRANSITO: 'Em trânsito',
  SAIU_PARA_ENTREGA: 'Saiu para entrega',
  ENTREGUE: 'Entregue',
  CANCELADO: 'Cancelado',
};

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
});

function formatCurrency(value: string | number): string {
  return currencyFormatter.format(Number(value));
}

function formatDate(value: string): string {
  return dateFormatter.format(new Date(value));
}

function OrderDetailsPage() {
  const router = useRouter();
  const { id } = router.query;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady || typeof id !== 'string') {
      return;
    }

    const controller = new AbortController();

    async function fetchOrder() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/orders/${id}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? 'Pedido não encontrado.'
              : 'Não foi possível carregar o pedido.',
          );
        }

        const data: Order = await response.json();

        setOrder(data);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : 'Erro ao carregar o pedido.',
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchOrder();

    return () => controller.abort();
  }, [router.isReady, id]);

  if (!router.isReady || loading) {
    return <main>Carregando pedido...</main>;
  }

  if (error || !order) {
    return (
      <main>
        <p role="alert">{error ?? 'Pedido não encontrado.'}</p>

        <button type="button" onClick={() => router.back()}>
          Voltar
        </button>
      </main>
    );
  }

  return (
    <main className="space-y-6 p-6">
      {/* Cabeçalho */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => router.push('/orders')}
            className="mb-2 text-sm text-gray-600 hover:underline"
          >
            ← Voltar para pedidos
          </button>

          <h1 className="text-2xl font-bold">
            Pedido #{order.id}
          </h1>

          <p className="text-sm text-gray-500">
            Criado em {formatDate(order.createdAt)}
          </p>
        </div>

        <span className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium">
          {orderStatusLabels[order.status]}
        </span>
      </header>

      {/* Resumo */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <article className="rounded-lg border p-4">
          <h2 className="text-sm text-gray-500">Total do pedido</h2>
          <p className="mt-2 text-xl font-bold">
            {formatCurrency(order.valor)}
          </p>
        </article>

        <article className="rounded-lg border p-4">
          <h2 className="text-sm text-gray-500">Itens</h2>
          <p className="mt-2 text-xl font-bold">
            {order.itens.length}
          </p>
        </article>

        <article className="rounded-lg border p-4">
          <h2 className="text-sm text-gray-500">Cliente</h2>
          <p className="mt-2 font-medium">
            {order.client.name ?? order.client.email ?? order.client.id}
          </p>
          {order.client.email && order.client.name && (
            <p className="text-sm text-gray-500">
              {order.client.email}
            </p>
          )}
        </article>
      </section>

      {/* Itens do pedido */}
      <section className="rounded-lg border">
        <div className="border-b p-4">
          <h2 className="text-lg font-semibold">Itens do pedido</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4">Produto</th>
                <th className="p-4">Preço unitário</th>
                <th className="p-4">Quantidade</th>
                <th className="p-4">Subtotal</th>
              </tr>
            </thead>

            <tbody>
              {order.itens.map((item) => {
                const unitPrice = Number(item.unitPrice);
                const quantity = item.quantity;

                return (
                  <tr key={item.id} className="border-t">
                    <td className="p-4">
                      <p className="font-medium">
                        {item.product.name}
                      </p>

                      {item.product.sku && (
                        <p className="text-xs text-gray-500">
                          SKU: {item.product.sku}
                        </p>
                      )}
                    </td>

                    <td className="p-4">
                      {formatCurrency(unitPrice)}
                    </td>

                    <td className="p-4">{quantity}</td>

                    <td className="p-4 font-medium">
                      {formatCurrency(unitPrice * quantity)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end border-t p-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">
              Total do pedido
            </p>

            <p className="text-xl font-bold">
              {formatCurrency(order.valor)}
            </p>
          </div>
        </div>
      </section>

      {/* Pagamento */}
      <section className="rounded-lg border p-4">
        <h2 className="mb-4 text-lg font-semibold">Pagamento</h2>

        {!order.pagamento ? (
          <p className="text-sm text-gray-500">
            Nenhum pagamento registrado.
          </p>
        ) : (
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-gray-500">Método</dt>
              <dd className="font-medium">
                {paymentMethodLabels[order.pagamento.metodo]}
              </dd>
            </div>

            <div>
              <dt className="text-sm text-gray-500">Status</dt>
              <dd className="font-medium">
                {paymentStatusLabels[order.pagamento.status]}
              </dd>
            </div>

            <div>
              <dt className="text-sm text-gray-500">Valor</dt>
              <dd className="font-medium">
                {formatCurrency(order.pagamento.valor.toString())}
              </dd>
            </div>

            <div>
              <dt className="text-sm text-gray-500">
                Identificador da transação
              </dt>
              <dd className="break-all font-medium">
                {order.pagamento.transactionId ?? 'Não informado'}
              </dd>
            </div>
          </dl>
        )}
      </section>

      {/* Entrega */}
      <section className="rounded-lg border p-4">
        <h2 className="mb-4 text-lg font-semibold">Entrega</h2>

        {!order.entrega ? (
          <p className="text-sm text-gray-500">
            Nenhuma entrega registrada.
          </p>
        ) : (
          <>
            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">
                  {deliveryStatusLabels[order.entrega.status]}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Frete</p>
                <p className="font-medium">
                  {formatCurrency(order.entrega.valorFrete.toString())}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Transportadora</p>
                <p className="font-medium">
                  {order.entrega.transportadora ?? 'Não informada'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Código de rastreio</p>
                <p className="break-all font-medium">
                  {order.entrega.codigoRastreio ?? 'Não informado'}
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="mb-2 font-medium">Endereço de entrega</h3>

              <p>
                {order.entrega.endereco}, {order.entrega.numero}
                {order.entrega.complemento
                  ? `, ${order.entrega.complemento}`
                  : ''}
              </p>

              <p>{order.entrega.bairro}</p>

              <p>
                {order.entrega.cidade} - {order.entrega.estado}
              </p>

              <p>CEP: {order.entrega.cep}</p>
            </div>
          </>
        )}
      </section>

      {/* Datas */}
      <footer className="text-sm text-gray-500">
        <p>Última atualização: {formatDate(order.updatedAt)}</p>
      </footer>
    </main>
  );
}

export default withAuthorization(OrderDetailsPage, ["ROLE_ADMIN"]);
