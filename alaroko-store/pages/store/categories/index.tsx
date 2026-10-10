import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Categoria } from '@/generated/prisma/browser';

export default function StoreCategoriesPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch('/api/categories')
      .then(response => response.json())
      .then(setCategories);
    setLoading(false);
  }, []);

  const handleCategoryClick = (slug: string) => {
    router.push(`/store/categories/${encodeURIComponent(slug)}`);
  };

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-gray-500">
          Explore nossa loja
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Categorias
        </h1>

        <p className="mx-auto mt-3 max-w-2xl text-gray-600">
          Encontre os produtos que você procura explorando nossas categorias.
        </p>
      </header>

      {loading && (
        <div
          role="status"
          className="py-16 text-center text-gray-500"
        >
          Carregando categorias...
        </div>
      )}

      {!loading && error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 p-6 text-center text-red-700"
        >
          {error}
        </div>
      )}

      {!loading && !error && categories.length === 0 && (
        <div className="rounded-lg border p-12 text-center">
          <h2 className="text-lg font-semibold">
            Nenhuma categoria disponível
          </h2>

          <p className="mt-2 text-gray-500">
            Volte em breve para conferir nossos produtos.
          </p>
        </div>
      )}

      {!loading && !error && categories.length > 0 && (
        <section
          aria-label="Categorias de produtos"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => handleCategoryClick(category.slug)}
              className="group overflow-hidden rounded-xl border bg-white text-left transition duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
                {category.image ? (
                  <img
                    src={category.image}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="h-16 w-16 text-gray-300"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 7.5 12 3l9 4.5M3 7.5l9 4.5m-9-4.5V17l9 4m0-9 9-4.5M12 12v9m9-13.5V17l-9 4"
                      />
                    </svg>
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {category.name}
                  </h2>

                  <span
                    aria-hidden="true"
                    className="text-xl text-gray-400 transition group-hover:translate-x-1 group-hover:text-gray-900"
                  >
                    →
                  </span>
                </div>

                {/* {category.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                    {category.description}
                  </p>
                )} */}

                {/* {category._count && (
                  <p className="mt-3 text-xs text-gray-500">
                    {category._count.products}{' '}
                    {category._count.products === 1
                      ? 'produto'
                      : 'produtos'}
                  </p>
                )} */}
              </div>
            </button>
          ))}
        </section>
      )}
    </main>
  );
}