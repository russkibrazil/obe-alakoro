import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Categoria } from '@/generated/prisma/client'

export default function ListCategoriesPage() {
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
    return <div>Carregando categorias...</div>;
  }

  return (
    <main>
      <header>
        <h1>Categorias</h1>

        <button type="button" onClick={handleNew}>
          Nova categoria
        </button>
      </header>

      {error && (
        <div role="alert">
          {error}
        </div>
      )}

      {categories.length === 0 ? (
        <p>Nenhuma categoria cadastrada.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Slug</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>{category.slug}</td>

                <td>
                  <button
                    type="button"
                    onClick={() => handleEdit(category.id)}
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(category.id)}
                    disabled={deletingId === category.id}
                  >
                    {deletingId === category.id
                      ? 'Apagando...'
                      : 'Apagar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
