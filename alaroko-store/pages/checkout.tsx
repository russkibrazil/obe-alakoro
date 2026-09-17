'use client';

import React, { useState } from 'react';

interface CheckoutProps {
  cartId: string;
  userId?: string;
}

export default function Checkout({ cartId, userId }: CheckoutProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcessCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartId, userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Falha ao processar o checkout');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-6 border rounded-md max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-2">Pedido Confirmado!</h2>
        <p className="text-gray-600">Obrigado pela sua compra. Seu pedido já está sendo processado.</p>
      </div>
    );
  }

  return (
    <div className="p-6 border rounded-md max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Finalizar Compra</h2>
      {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
      <p className="mb-6 text-gray-600">Clique no botão abaixo para simular o pagamento e fechar o pedido.</p>
      <button
        onClick={handleProcessCheckout}
        disabled={loading}
        className="w-full py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Processando...' : 'Confirmar e Pagar'}
      </button>
    </div>
  );
}