import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/generated/prisma/client';

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;

  const [productData, setProductData] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!id) return; // Aguarda o router carregar o parâmetro da URL

    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProductData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar produto:', err);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = async () => {
    setSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer TOKEN_SE_AUTENTICADO' 
        },
        body: JSON.stringify({ productId: id, quantity }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Produto adicionado com sucesso ao carrinho!');
      } else {
        setMessage(data.error || 'Erro ao adicionar ao carrinho.');
      }
    } catch (error) {
      setMessage('Erro de conexão ao adicionar ao carrinho.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Carregando produto...</div>;
  if (!productData) return <div className="p-8 text-center text-red-500">Produto não encontrado.</div>;

  const product = productData;

  return (
    <main className="max-w-6xl mx-auto p-4 md:p-8 font-sans">
      {/* Seção Principal do Produto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden shadow-sm">
          <Image 
            src={product.image ?? "#"} 
            alt={product.name} 
            fill 
            className="object-cover" 
            priority
          />
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">{product.categoriaId}</span>
            <h1 className="text-3xl font-bold mt-1 mb-3 text-gray-900">{product.name}</h1>
            <p className="text-2xl font-semibold text-gray-800 mb-4">R$ {product.price.toFixed(2)}</p>
            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center gap-4 mb-4">
              <label htmlFor="quantity" className="font-medium text-sm text-gray-700">Quantidade:</label>
              <input 
                id="quantity"
                type="number" 
                min="1" 
                value={quantity} 
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 border border-gray-300 rounded-md px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button 
              onClick={handleAddToCart}
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50"
            >
              {submitting ? 'Adicionando...' : 'Adicionar ao Carrinho'}
            </button>

            {message && <p className="mt-3 text-sm text-center font-medium text-green-600">{message}</p>}
          </div>
        </div>
      </div>

      {/* Banner de Sugestões da Mesma Categoria */}
      {/* {suggestions && suggestions.length > 0 && (
        <section className="mt-16 border-t pt-10">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Você também pode gostar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {suggestions.map((item) => (
              <Link key={item.id} href={`/products/${item.id}`} className="group border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition block">
                <div className="relative w-full h-48 bg-gray-100 rounded-md mb-3 overflow-hidden">
                  <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition duration-200" />
                </div>
                <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition">{item.name}</h3>
                <p className="text-gray-600 font-medium mt-1">R$ {item.price.toFixed(2)}</p>
              </Link>
            ))}
          </div>
        </section>
      )} */}
    </main>
  );
}