
import Link from 'next/link'
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useMemo, useState } from 'react'
import { prisma } from '../../../lib/prisma'

type Product = {
  id: string
  name: string
  price: number
  createdAt: string
}

type ProductsPageProps = {
  products: Product[]
}

export const getServerSideProps: GetServerSideProps<
  ProductsPageProps
> = async () => {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  return {
    props: {
      products: products.map((product) => ({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        createdAt: product.createdAt.toISOString(),
      })),
    },
  }
}

export default function ProductsPage({
  products,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase())

      return matchesSearch
    })
  }, [products, search])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Gestão de catálogo
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Gerencie os produtos cadastrados na loja.
            </p>
          </div>

          <Link
            href="/adm/products/new"
            className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
          >
            + Novo produto
          </Link>
        </header>

        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 p-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Produtos
              </h2>
              <p className="text-sm text-gray-500">
                {filteredProducts.length} produto(s) encontrado(s)
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <input
                type="search"
                placeholder="Buscar produto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-violet-500"
              >
                <option value="all">Todos os status</option>
                <option value="active">Ativos</option>
                <option value="inactive">Inativos</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Produto</th>
                  <th className="px-5 py-4 font-semibold">Preço</th>
                  <th className="px-5 py-4 font-semibold">Cadastro</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 text-right font-semibold">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-900">
                      {product.name}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                      {formatPrice(product.price)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                      {new Date(product.createdAt).toLocaleDateString(
                        'pt-BR'
                      )}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                        Ativo
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <Link
                        href={`/adm/products/${product.id}/edit`}
                        className="font-medium text-violet-600 hover:text-violet-800"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredProducts.length === 0 && (
              <div className="p-10 text-center text-sm text-gray-500">
                Nenhum produto encontrado.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}