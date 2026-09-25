
import Link from 'next/link'
import { useRouter } from 'next/router'
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from 'next'
import { prisma } from '../../../lib/prisma'

type Product = {
  id: string
  name: string
  description: string | null
  price: number
  stock: number
  category: string | null
  image: string | null
  createdAt: string
}

type ProductPageProps = {
  product: Product
}

export const getServerSideProps: GetServerSideProps<
  ProductPageProps
> = async (context) => {
  const id = context.params?.id

  if (typeof id !== 'string') {
    return {
      notFound: true,
    }
  }

  const product = await prisma.product.findUnique({
    where: {
      id,
    },
  })

  if (!product) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: Number(product.price),
        stock: product.stock,
        category: product.category,
        image: product.image,
        createdAt: product.createdAt.toISOString(),
      },
    },
  }
}

export default function ProductPage({
  product,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <Link
            href="/adm/products"
            className="text-sm font-medium text-violet-600 hover:text-violet-800"
          >
            ← Voltar para produtos
          </Link>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Gestão de produto
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Visualize e gerencie as informações do produto.
              </p>
            </div>

            <Link
              href={`/adm/products/${product.id}/edit`}
              className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
            >
              Editar produto
            </Link>
          </div>
        </header>

        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Informações do produto
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              ID: {product.id}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 p-6 md:grid-cols-2">
            <div>
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-80 w-full rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-80 items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-400">
                  Sem imagem cadastrada
                </div>
              )}
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-sm text-gray-500">Nome</p>
                <h3 className="mt-1 text-xl font-semibold text-gray-900">
                  {product.name}
                </h3>
              </div>

              <div>
                <p className="text-sm text-gray-500">Descrição</p>
                <p className="mt-1 text-gray-700">
                  {product.description || 'Sem descrição cadastrada.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Preço</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {formatPrice(product.price)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Estoque</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {product.stock} unidade(s)
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Categoria</p>
                <p className="mt-1 text-gray-900">
                  {product.category || 'Sem categoria'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Data de cadastro</p>
                <p className="mt-1 text-gray-900">
                  {formatDate(product.createdAt)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-between gap-3 border-t border-gray-200 p-6">
            <button
              type="button"
              onClick={() => router.push('/adm/products')}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100"
            >
              Voltar
            </button>

            <Link
              href={`/adm/products/${product.id}/edit`}
              className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
            >
              Editar produto
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}