'use client';

import React, { useEffect, useState } from 'react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category: { name: string };
}

interface ProductCatalogProps {
  cartId: string;
}

export default function ProductCatalog({ cartId }: ProductCatalogProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);

  // Carrega os produtos e categorias da API
  const loadProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('q', search);
      if (selectedCategory) queryParams.append('category', selectedCategory);

      const res = await fetch(`/api/products?${queryParams.toString()}`);
      const data = await res.json();

      setProducts(data.products || []);
      setCategories(data.categories || []);
    } catch (err) {
      console.error('Erro ao buscar catálogo:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  // Handler do formulário de busca
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadProducts();
  };

  // Função para adicionar o produto ao carrinho
  const handleAddToCart = async (productId: string) => {
    setAddingId(productId);
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartId, productId, quantity: 1 }),
      });
      alert('Produto adicionado ao carrinho!');
    } catch (err) {
      console.error('Erro ao adicionar item:', err);
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Catálogo de Produtos</h1>

      {/* Barra de Filtros e Pesquisa */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
          <input
            type="text"
            placeholder="Buscar por nome ou descrição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Buscar
          </button>
        </form>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todas as Categorias</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Grid de Produtos */}
      {loading ? (
        <p className="text-center py-10">Carregando produtos...</p>
      ) : products.length === 0 ? (
        <p className="text-center py-10 text-gray-500">
          Nenhum produto encontrado.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg overflow-hidden shadow-sm flex flex-col justify-between p-4"
            >
              <div>
                <div className="h-40 bg-gray-100 rounded-md mb-4 flex items-center justify-center text-gray-400">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover rounded-md"
                    />
                  ) : (
                    <span>Sem imagem</span>
                  )}
                </div>
                <span className="text-xs text-blue-600 font-semibold uppercase">
                  {product.category.name}
                </span>
                <h3 className="font-bold text-lg mt-1">{product.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                  {product.description}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t flex items-center justify-between">
                <span className="text-xl font-bold text-gray-900">
                  R$ {product.price.toFixed(2)}
                </span>
                <button
                  onClick={() => handleAddToCart(product.id)}
                  disabled={addingId === product.id}
                  className="px-3 py-1.5 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                >
                  {addingId === product.id ? 'Adicionando...' : 'Adicionar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}