import Link from "next/link";

function formatPrice(price: string): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(price));
}

function ShoppingBagIcon() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      aria-hidden="true"
    >
      <path d="M5 8h14l1 13H4L5 8Z" />
      <path d="M9 9V6a3 3 0 0 1 6 0v3" />
    </svg>
  );
}

function ProductCard({ product }: { product: StoreProduct }) {
  const unavailable = product.stock <= 0;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition hover:-translate-y-1 hover:shadow-lg">
      <Link
        href={`/store/products/${product.id}`}
        className="relative block aspect-square overflow-hidden bg-gray-50"
        aria-label={`Ver produto ${product.name}`}
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300">
            <ShoppingBagIcon />
          </div>
        )}

        {unavailable && (
          <span className="absolute left-3 top-3 rounded-full bg-gray-900/80 px-3 py-1 text-xs font-medium text-white">
            Esgotado
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        {product.category && (
          <Link
            href={`/store/categories/${product.category.slug}`}
            className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500 hover:text-indigo-600"
          >
            {product.category.name}
          </Link>
        )}

        <Link href={`/store/products/${product.id}`}>
          <h3 className="line-clamp-2 min-h-12 font-medium text-gray-900 transition hover:text-indigo-600">
            {product.name}
          </h3>
        </Link>

        {product.description && (
          <p className="mt-1 line-clamp-2 text-sm text-gray-500">
            {product.description}
          </p>
        )}

        <div className="mt-auto pt-4">
          <p className="text-xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </p>

          <Link
            href={`/store/products/${product.id}`}
            aria-disabled={unavailable}
            className={`mt-3 flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition ${
              unavailable
                ? "pointer-events-none bg-gray-100 text-gray-600"
                : "bg-gray-900 text-white hover:bg-indigo-700"
            }`}
          >
            {unavailable ? "Indisponível" : "Ver produto"}
          </Link>
        </div>
      </div>
    </article>
  );
}