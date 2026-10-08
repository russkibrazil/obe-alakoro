import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { ProductForm } from '@/components/forms/ProductForm'
import { Categoria, Product } from '@/generated/prisma/client'
import { FormError } from '@/components/forms/FormError'

export default function NewProductPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Categoria[]>([]);

  const handleSubmit = async (values: any, { setSubmitting, setStatus, setErrors }: any) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error('Não foi possível cadastrar o produto.')
      }

      await router.push('/admin/products')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ocorreu um erro ao cadastrar.'
      )
    } finally {
      setLoading(false)
      setSubmitting(false)
    }
  }

  useEffect(() => {fetch('/api/categories')
    .then(response => response.json())
    .then(setCategories);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
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
        <ProductForm
          initialData={{} as Product}
          submitFn={handleSubmit}
          isSubmitting={loading}
          categories={categories}
        />
        {error && <FormError errorTxt={error} />}
      </div>
    </main>
  )
}