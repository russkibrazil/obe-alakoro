import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {CardProduct} from "../../../components/cards/CardProduct";
import { CustomerCartManagement } from '@/services/cartManagement';
import { useSession } from "next-auth/react";
import { AnonymousCartProduct } from "@/store/cartStore";

interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number | string;
  stock: number;
  active: boolean;
  image?: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  products: Product[];
}

export default function CategoryProductsPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {status} = useSession();
  const cart = useMemo(
    () => new CustomerCartManagement(status === 'authenticated'),
    [status]
  );

  useEffect(() => {
    if (!router.isReady || typeof slug !== "string") {
      return;
    }

    const controller = new AbortController();

    async function fetchCategory() {
      setLoading(true);
      setError(null);

      try {
        const responseCategory = await fetch(
          `/api/categories/?slug=${encodeURIComponent(slug)}`,
          { signal: controller.signal }
        );

        if (responseCategory.status === 404) {
          setCategory(null);
          setError("Categoria não encontrada.");
          return;
        }

        if (!responseCategory.ok) {
          throw new Error("Não foi possível carregar os produtos.");
        }

        const category: Category = await responseCategory.json();

        const responseProducts = await fetch(`/api/products?categoriaId=${category?.id}`,
          { signal: controller.signal }
        );

        if (!responseProducts.ok) {
          throw new Error("Não foi possível carregar os produtos.");
        }

        const products:Product[] = await responseProducts.json();

        setCategory({
          ...category,
          products
        });
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

    fetchCategory();

    return () => controller.abort();
  }, [router.isReady, slug]);


  if (!router.isReady || loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12">
        <p className="text-center text-gray-500">
          Carregando produtos...
        </p>
      </main>
    );
  }

  if (error || !category) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Categoria indisponível
          </h1>

          <p className="mt-2 text-gray-600">
            {error ?? "Não foi possível encontrar esta categoria."}
          </p>

          <Link
            href="/store/categories"
            className="mt-6 inline-block text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            Voltar para as categorias
          </Link>
        </div>
      </main>
    );
  }

  const products = category.products.filter(
    (product) => product.active
  );

  const handleAddToCart = async (productData: AnonymousCartProduct) => {
    await cart.addItem(productData.id, 1, productData)
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Navegação */}
      <nav className="mb-6 text-sm text-gray-500">
        <Link
          href="/store"
          className="hover:text-gray-900"
        >
          Loja
        </Link>

        <span className="mx-2">/</span>

        <Link
          href="/store/categories"
          className="hover:text-gray-900"
        >
          Categorias
        </Link>

        <span className="mx-2">/</span>

        <span className="text-gray-900">{category.name}</span>
      </nav>

      {/* Cabeçalho */}
      <header className="mb-8 border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {category.name}
        </h1>

        {category.description && (
          <p className="mt-3 max-w-2xl text-gray-600">
            {category.description}
          </p>
        )}

        <p className="mt-4 text-sm text-gray-500">
          {products.length}{" "}
          {products.length === 1 ? "produto encontrado" : "produtos encontrados"}
        </p>
      </header>

      {/* Produtos */}
      {products.length > 0 ? (
        <section
          aria-label={`Produtos da categoria ${category.name}`}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {products.map((product) => (
            <CardProduct
              key={product.id}
              id={product.id}
              // O modelo atual não possui slug.
              // O Card deve usar esse valor como identificador
              // enquanto a página de detalhes utilizar o ID.
              slug={product.id}
              src={product.image}
              productName={product.name}
              description={product.description}
              price={Number(product.price)}
              stock={product.stock}
              active={product.active}
              categoryName={category.name}
              onAddToCart={() => handleAddToCart({...product, price: Number(product.price)})}
            />
          ))}
        </section>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-300 px-6 py-16 text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Nenhum produto disponível
          </h2>

          <p className="mt-2 text-gray-500">
            Ainda não há produtos disponíveis nesta categoria.
          </p>

          <Link
            href="/store/categories"
            className="mt-5 inline-block text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            Explorar outras categorias
          </Link>
        </div>
      )}
    </main>
  );
}