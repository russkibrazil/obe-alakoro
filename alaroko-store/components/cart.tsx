'use client';

import React, { useEffect, useState } from 'react';

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
}

interface CartProps {
  cartId: string;
}

export default function Cart({ cartId }: CartProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Carrega os dados do carrinho ao montar o componente
  useEffect(() => {
    async function fetchCart() {
      try {
        const response = await fetch(`/api/cart?cartId=${cartId}`);
        const data = await response.json();
        if (data?.items) {
          setItems(data.items);
        }
      } catch (error) {
        console.error('Erro ao carregar o carrinho:', error);
      } finally {
        setLoading(false);
      }
    }

    if (cartId) {
      fetchCart();
    }
  }, [cartId]);

  // Função para remover um item
  const handleRemoveItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/cart?itemId=${itemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
      }
    } catch (error) {
      console.error('Erro ao remover o item:', error);
    }
  };

  if (loading) {
    return <p>Carregando carrinho...</p>;
  }

  return (
    <div className="p-4 border rounded-md max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Seu Carrinho</h2>
      {items.length === 0 ? (
        <p>O seu carrinho está vazio.</p>
      ) : (
        <ul className="divide-y">
          {items.map((item) => (
            <li key={item.id} className="py-2 flex justify-between items-center">
              <div>
                <p className="font-medium">Produto ID: {item.productId}</p>
                <p className="text-sm text-gray-500">Qtd: {item.quantity}</p>
              </div>
              <button
                onClick={() => handleRemoveItem(item.id)}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}