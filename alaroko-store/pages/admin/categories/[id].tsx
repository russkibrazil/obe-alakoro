import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Categoria } from '@/generated/prisma/client'
import { FormError } from '@/components/forms/FormError'
import { CategoryForm } from '@/components/forms/CategoryForm'

function ShowCategoryPage() {
  const router = useRouter()
  const categoryId = typeof router.query.id === 'string' ? router.query.id : router.query.id?.at(0);

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('');
  const [category, setCategory] = useState<Categoria|null>(null);

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

      if (!response.ok) {
        throw new Error('Não foi possível cadastrar a categoria.')
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

  useEffect(() => {
    fetch(`api/categories/${categoryId}`)
      .then(response => response.json())
      .then(setCategory);
  }, [categoryId]);

  if (category == null) {
    return <>Not found</>
  }
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">
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
          initialData={category}
          submitFn={handleSubmit}
          isSubmitting={loading}
        />
        {error && <FormError errorTxt={error} />}
      </div>
    </main>
  );
}

export default ShowCategoryPage;