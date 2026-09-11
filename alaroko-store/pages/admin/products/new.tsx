
import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/router'

type ProductForm = {
  name: string
  description: string
  price: string
  stock: string
  category: string
  image: string
}

export default function NewProductPage() {
  const router = useRouter()

  const [form, setForm] = useState<ProductForm>({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (
    field: keyof ProductForm,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: Number(form.price),
          stock: Number(form.stock),
          category: form.category,
          image: form.image,
        }),
      })

      if (!response.ok) {
        throw new Error('Não foi possível cadastrar o produto.')
      }

      await router.push('/adm/products')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ocorreu um erro ao cadastrar.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <button
            type="button"
            onClick={() => router.push('/adm/products')}
            className="mb-4 text-sm font-medium text-violet-600 hover:text-violet-800"
          >
            ← Voltar para produtos
          </button>

          <h1 className="text-2xl font-bold text-gray-900">
            Cadastrar produto
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Adicione um novo produto ao catálogo da loja.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold text-gray-900">
              Informações do produto
            </h2>

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Nome do produto
                </label>

                <input
                  id="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) =>
                    handleChange('name', e.target.value)
                  }
                  placeholder="Digite o nome do produto"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Descrição
                </label>

                <textarea
                  id="description"
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    handleChange('description', e.target.value)
                  }
                  placeholder="Descreva o produto..."
                  className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="price"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Preço (R$)
                  </label>

                  <input
                    id="price"
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) =>
                      handleChange('price', e.target.value)
                    }
                    placeholder="0,00"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="stock"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Estoque
                  </label>

                  <input
                    id="stock"
                    type="number"
                    required
                    min="0"
                    step="1"
                    value={form.stock}
                    onChange={(e) =>
                      handleChange('stock', e.target.value)
                    }
                    placeholder="Quantidade disponível"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Categoria
                </label>

                <select
                  id="category"
                  required
                  value={form.category}
                  onChange={(e) =>
                    handleChange('category', e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="roupas">Roupas</option>
                  <option value="acessorios">Acessórios</option>
                  <option value="casa">Casa</option>
                  <option value="outros">Outros</option>
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold text-gray-900">
              Imagem do produto
            </h2>

            <div>
              <label
                htmlFor="image"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                URL da imagem
              </label>

              <input
                id="image"
                type="url"
                value={form.image}
                onChange={(e) =>
                  handleChange('image', e.target.value)
                }
                placeholder="https://exemplo.com/imagem.jpg"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />

              <p className="mt-2 text-xs text-gray-500">
                Informe o endereço da imagem que será exibida no catálogo.
              </p>
            </div>
          </section>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push('/adm/products')}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Salvando...' : 'Cadastrar produto'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}