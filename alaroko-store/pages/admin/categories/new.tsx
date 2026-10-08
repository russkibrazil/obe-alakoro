import { useState } from 'react'
import { useRouter } from 'next/router'
import { CategoryForm } from '@/components/forms/CategoryForm'
import { Categoria } from '@/generated/prisma/client'
import { FormError } from '@/components/forms/FormError'

export default function NewCategoryPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (values: any, { setSubmitting, setStatus, setErrors }: any) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Não foi possível cadastrar a categoria.'
        )
      }

      await router.push('/admin/categories')
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

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <button
            type="button"
            onClick={() => router.push('/admin/categories')}
            className="mb-4 text-sm font-medium text-violet-600 hover:text-violet-800"
          >
            ← Voltar para categorias
          </button>

          <h1 className="text-2xl font-bold text-gray-900">
            Cadastrar categoria
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Adicione uma nova categoria ao catálogo da loja.
          </p>
        </header>

        <CategoryForm 
          submitFn={handleSubmit}
          isSubmitting={loading}
          initialData={{} as Categoria} 
        />
        {error && <FormError errorTxt={error} />}
      </div>
    </main>
  )
}