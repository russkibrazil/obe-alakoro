import Image from 'next/image';
import Link from 'next/link';

interface CardProps {
  id: string;
  slug?: string;
  src?: string | null;
  productName: string;
  description?: string | null;
  price: number;
  originalPrice?: number | null;
  categoryName?: string;
  stock: number;
  active: boolean;
  onAddToCart?: (productId: string) => void;
}

export function CardProduct({
  id,
  slug,
  src,
  productName,
  description,
  price,
  originalPrice,
  categoryName,
  stock,
  active,
  onAddToCart,
}: CardProps) {
  const available = active && stock > 0;

  const hasDiscount =
    originalPrice !== undefined &&
    originalPrice !== null &&
    originalPrice > price;

  const formatPrice = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice! - price) / originalPrice!) * 100)
    : 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg">
      {/* Imagem */}
      <Link
        href={`/store/products/${id}`}
        className="relative block aspect-square overflow-hidden bg-gray-50"
        aria-label={`Ver detalhes de ${productName}`}
      >
        {src ? (
          <Image
            src={src}
            alt={productName}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-500">
            Sem imagem
          </div>
        )}

        {hasDiscount && (
          <span className="absolute left-3 top-3 rounded-md bg-red-600 px-2 py-1 text-xs font-semibold text-white">
            -{discountPercentage}%
          </span>
        )}

        {!available && (
          <span className="absolute bottom-3 left-3 rounded-md bg-gray-900/80 px-2 py-1 text-xs font-medium text-white">
            Indisponível
          </span>
        )}
      </Link>

      {/* Informações */}
      <div className="flex flex-1 flex-col p-4">
        {categoryName && (
          <span className="mb-1 text-xs text-gray-500">
            {categoryName}
          </span>
        )}

        <Link
          href={`/store/products/${id}`}
          className="line-clamp-2 font-medium text-gray-900 hover:text-blue-600"
        >
          {productName}
        </Link>

        {description && (
          <p className="mt-2 line-clamp-2 text-sm text-gray-500">
            {description}
          </p>
        )}

        {/* Preço */}
        <div className="mt-auto pt-4">
          {hasDiscount && (
            <p className="text-sm text-gray-500 line-through">
              {formatPrice(originalPrice!)}
            </p>
          )}

          <p className="text-xl font-bold text-gray-900">
            {formatPrice(price)}
          </p>

          {/* Ação */}
          <button
            type="button"
            disabled={!available || !onAddToCart}
            onClick={() => onAddToCart?.(id)}
            className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {!available
              ? 'Indisponível'
              : onAddToCart
                ? 'Adicionar ao carrinho'
                : 'Ver detalhes'}
          </button>
        </div>
      </div>
    </article>
  );
}