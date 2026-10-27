import { useEffect, useState } from "react";
import Link from "next/link";
import { withAuthorization } from "@/components/withAuthorization";
import StatCard from "@/components/common/StatCard";
import StatusBadge from "@/components/common/StatusBadge";
import QuickLink from "@/components/common/QuickLink";

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELED"
  | "REFUNDED";

type PaymentStatus =
  | "PENDENTE"
  | "PROCESSANDO"
  | "APROVADO"
  | "RECUSADO"
  | "CANCELADO"
  | "ESTORNADO";

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  lowStockProducts: number;
  totalRevenue: number;
  averageOrderValue: number;
}

interface RecentOrder {
  id: string;
  valor: number;
  status: OrderStatus;
  createdAt: string;
  client: {
    id: string;
    name: string;
    email: string;
  };
  pagamento: {
    status: PaymentStatus;
  } | null;
}

interface LowStockProduct {
  id: string;
  name: string;
  stock: number;
  sku: string | null;
}

interface DashboardData {
  stats: DashboardStats;
  recentOrders: RecentOrder[];
  lowStockProducts: LowStockProduct[];
}

const orderStatusLabels: Record<OrderStatus, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
  PROCESSING: "Em preparação",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELED: "Cancelado",
  REFUNDED: "Estornado",
};

const paymentStatusLabels: Record<PaymentStatus, string> = {
  PENDENTE: "Pendente",
  PROCESSANDO: "Processando",
  APROVADO: "Aprovado",
  RECUSADO: "Recusado",
  CANCELADO: "Cancelado",
  ESTORNADO: "Estornado",
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function getStatusClass(status: OrderStatus): string {
  const classes: Record<OrderStatus, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    PROCESSING: "bg-indigo-100 text-indigo-800",
    SHIPPED: "bg-purple-100 text-purple-800",
    DELIVERED: "bg-green-100 text-green-800",
    CANCELED: "bg-red-100 text-red-800",
    REFUNDED: "bg-gray-100 text-gray-800",
  };

  return classes[status];
}

function getPaymentStatusClass(status: PaymentStatus): string {
  const classes: Record<PaymentStatus, string> = {
    PENDENTE: "bg-yellow-100 text-yellow-800",
    PROCESSANDO: "bg-blue-100 text-blue-800",
    APROVADO: "bg-green-100 text-green-800",
    RECUSADO: "bg-red-100 text-red-800",
    CANCELADO: "bg-gray-100 text-gray-800",
    ESTORNADO: "bg-purple-100 text-purple-800",
  };

  return classes[status];
}

function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchDashboard() {
      try {
        const response = await fetch("/api/dashboard", {
          credentials: "include",
          signal: controller.signal,
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            throw new Error(
              "Você não tem autorização para acessar o dashboard."
            );
          }

          throw new Error("Não foi possível carregar os dados.");
        }

        const result: DashboardData = await response.json();

        setData(result);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Ocorreu um erro inesperado."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchDashboard();

    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-gray-500">Carregando dashboard...</p>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-gray-50 p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard administrativo
          </h1>

          <p role="alert" className="mt-4 text-red-600">
            {error ?? "Não foi possível carregar os dados."}
          </p>
        </div>
      </main>
    );
  }

  const { stats, recentOrders, lowStockProducts } = data;

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Cabeçalho */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Dashboard administrativo
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Acompanhe as vendas, os pedidos e o estoque da sua loja.
            </p>
          </div>

          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            + Novo produto
          </Link>
        </header>

        {/* Indicadores */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Visão geral
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Faturamento recebido"
              value={formatCurrency(stats.totalRevenue)}
              description="Total de pagamentos aprovados, conforme o período definido pela API"
            />

            <StatCard
              title="Pedidos"
              value={stats.totalOrders}
              description="Quantidade de pedidos no período"
            />

            <StatCard
              title="Pedidos pendentes"
              value={stats.pendingOrders}
              description="Pedidos aguardando processamento"
            />

            <StatCard
              title="Ticket médio"
              value={formatCurrency(stats.averageOrderValue)}
              description="Valor médio dos pedidos considerados no cálculo"
            />
          </div>
        </section>

        {/* Indicadores de estoque */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Estoque
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StatCard
              title="Produtos cadastrados"
              value={stats.totalProducts}
              description="Total de produtos registrados na loja"
            />

            <StatCard
              title="Produtos com estoque baixo"
              value={stats.lowStockProducts}
              description="Produtos que precisam de reposição"
            />
          </div>
        </section>

        {/* Pedidos recentes */}
        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 p-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Pedidos recentes
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Acompanhe os últimos pedidos realizados.
              </p>
            </div>

            <Link
              href="/admin/orders"
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Ver todos
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="p-8 text-center text-sm text-gray-500">
              Nenhum pedido encontrado.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-212 text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-5 py-3 font-medium">Pedido</th>
                    <th className="px-5 py-3 font-medium">Cliente</th>
                    <th className="px-5 py-3 font-medium">Data</th>
                    <th className="px-5 py-3 font-medium">Valor</th>
                    <th className="px-5 py-3 font-medium">Pagamento</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Ações</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4 font-medium text-gray-900">
                        #{order.id.slice(-8).toUpperCase()}
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-900">
                          {order.client.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {order.client.email}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                        {formatDate(order.createdAt)}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-900">
                        {formatCurrency(order.valor)}
                      </td>

                      <td className="px-5 py-4">
                        {order.pagamento ? (
                          <StatusBadge
                            label={
                              paymentStatusLabels[
                                order.pagamento.status
                              ]
                            }
                            className={getPaymentStatusClass(
                              order.pagamento.status
                            )}
                          />
                        ) : (
                          <span className="text-gray-500">
                            Não registrado
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge
                          label={orderStatusLabels[order.status]}
                          className={getStatusClass(order.status)}
                        />
                      </td>

                      <td className="px-5 py-4">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="font-medium text-blue-600 hover:text-blue-800"
                        >
                          Detalhes
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Alertas de estoque */}
        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 p-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Alertas de estoque
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Produtos que podem precisar de reposição.
              </p>
            </div>

            <Link
              href="/admin/products"
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Gerenciar produtos
            </Link>
          </div>

          {lowStockProducts.length === 0 ? (
            <p className="p-8 text-center text-sm text-gray-500">
              Nenhum produto com estoque baixo.
            </p>
          ) : (
            <div className="divide-y divide-gray-100">
              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="font-medium text-gray-900 hover:text-blue-600"
                    >
                      {product.name}
                    </Link>

                    {product.sku && (
                      <p className="mt-1 text-xs text-gray-500">
                        SKU: {product.sku}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge
                      label={
                        product.stock === 0
                          ? "Sem estoque"
                          : `${product.stock} unidades`
                      }
                      className={
                        product.stock === 0
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    />

                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      Atualizar
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Acesso rápido */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Acesso rápido
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <QuickLink
              href="/admin/products"
              title="Produtos"
              description="Cadastrar, editar e gerenciar o estoque."
            />

            <QuickLink
              href="/admin/categories"
              title="Categorias"
              description="Organizar os produtos da loja."
            />

            <QuickLink
              href="/admin/orders"
              title="Pedidos"
              description="Consultar pedidos e atualizar seus status."
            />

            <QuickLink
              href="/admin/payments"
              title="Pagamentos"
              description="Consultar transações e seus resultados."
            />
          </div>
        </section>
      </div>
    </main>
  );
}

export default withAuthorization(AdminDashboardPage, ["ROLE_ADMIN"]);
