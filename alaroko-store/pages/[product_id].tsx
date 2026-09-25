import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import AddToCartForm from './add-to-cart-form';

const prisma = new PrismaClient();

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = params;

  // Busca diretamente no banco de dados via Server Component
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto p-6 my-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Imagem do Produto */}
        <div className="w-full h-96 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400">Sem imagem disponível</span>
          )}
        </div>

        {/* Informações e Ações do Produto */}
        <div className="flex flex-col space-y-6">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              {product.category.name}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">
              {product.name}
            </h1>
            <p className="text-2xl font-semibold text-gray-800 mt-2">
              R$ {product.price.toFixed(2)}
            </p>
          </div>

          <div className="border-t border-b py-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">
              Descrição do produto
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              {product.description || 'Nenhuma descrição fornecida para este produto.'}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-3">
              Estoque disponível: <span className="font-medium">{product.stock} unidades</span>
            </p>

            {/* Form de Adicionar ao Carrinho */}
            <AddToCartForm productId={product.id} stock={product.stock} />
          </div>
        </div>
      </div>
    </div>
  );
}