import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Categoria } from '@/generated/prisma/client'
import { withAuthorization } from '@/components/withAuthorization';

function ListCategoriesPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/categories');

        if (!response.ok) {
          throw new Error('Não foi possível carregar as categorias.');
        }

        const data = await response.json();

        setCategories(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Erro ao carregar categorias.',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Deseja realmente apagar esta categoria?')) {
      return;
    }

    try {
      setDeletingId(id);
      setError(null);

      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Não foi possível apagar a categoria.');
      }

      setCategories((current) =>
        current.filter((category) => category.id !== id),
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Erro ao apagar categoria.',
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/categories/${id}`);
  };

  const handleNew = () => {
    router.push('/admin/categories/new');
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div
            className="rounded-xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500 shadow-sm"
            role="status"
          >
            Carregando categorias...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Categorias</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gerencie as categorias cadastradas na loja.
            </p>
          </div>

          <button
            type="button"
            onClick={handleNew}
            className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
          >
            + Nova categoria
          </button>
        </header>

        {error && (
          <div
            className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {error}
          </div>
        )}

        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900">Categorias</h2>
            <p className="text-sm text-gray-500">
              {categories.length}{' '}
              {categories.length === 1
                ? 'categoria cadastrada'
                : 'categorias cadastradas'}
            </p>
          </div>

          {categories.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-sm font-medium text-gray-900">
                Nenhuma categoria cadastrada.
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Crie uma categoria para organizar os produtos da loja.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th scope="col" className="px-5 py-4 font-semibold">
                      Nome
                    </th>
                    <th scope="col" className="px-5 py-4 font-semibold">
                      Slug
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-4 text-right font-semibold"
                    >
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {categories.map((category) => (
                    <tr
                      key={category.id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-900">
                        {category.name}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                        {category.slug}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-right">
                        <div className="flex justify-end gap-4">
                          <button
                            type="button"
                            onClick={() => handleEdit(category.id)}
                            className="font-medium text-violet-600 transition hover:text-violet-800 focus:outline-none focus:underline"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(category.id)}
                            disabled={deletingId === category.id}
                            className="font-medium text-red-600 transition hover:text-red-800 focus:outline-none focus:underline disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId === category.id
                              ? 'Apagando...'
                              : 'Apagar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}


export default withAuthorization(ListCategoriesPage, ["ROLE_ADMIN"]);
