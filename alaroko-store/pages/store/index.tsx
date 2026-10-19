import { CardProduct } from '@/components/cards/CardProduct';
import { Product, Categoria } from '@/generated/prisma/client';
import { CustomerCartManagement } from '@/services/cartManagement';
import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { AnonymousCartProduct } from '@/store/cartStore';

export default function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const {status} = useSession();
  const cart = new CustomerCartManagement(status === 'authenticated');

  // Carrega os produtos e categorias da API
  const loadProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('q', search);
      if (selectedCategory) queryParams.append('category', selectedCategory);

      const res = await fetch(`/api/products${selectedCategory ? `?categoriaId=${selectedCategory}` : ''}`);
      const data = await res.json();

      setProducts(data || []);
      
    } catch (err) {
      console.error('Erro ao buscar catálogo:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    setLoading(true);
    const res = await fetch(`/api/categories`);
    const data = await res.json();
    setCategories(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadProducts();
    if (categories.length == 0) {
      loadCategories();
    }
  }, [selectedCategory]);

  // Handler do formulário de busca
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadProducts();
  };

  // Função para adicionar o produto ao carrinho
  const handleAddToCart = async (productData: AnonymousCartProduct) => {
    await cart.addItem(productData.id, 1, productData)
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
        <CardProduct 
          productName={product.name}
          price={Number(product.price)}
          active
          stock={product.stock}
          id={product.id}
          onAddToCart={() => handleAddToCart({...product, price: Number(product.price)})}
        />
      ))}
        </div>
      )}
    </div>
  );
}