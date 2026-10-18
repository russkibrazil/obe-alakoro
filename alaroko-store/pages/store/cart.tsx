import Button from '@/components/common/Button';
import { CustomerCartManagement } from '@/services/cartManagement';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useSession } from "next-auth/react";
import Link from 'next/link';

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
}

export default function Cart() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string|null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const {status} = useSession();
  
  const cart = useMemo(
    () => new CustomerCartManagement(status === 'authenticated'),
    [status]
  );

  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    let cancelled = false;

    async function loadCart() {
      setLoading(true);
      setError(null);

      try {
        if (status === 'authenticated') {
          await cart.setIsUserAutenticated(true);
        }

        const result = await cart.getCart();

        if (!cancelled) {
          setItems(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Erro ao carregar o carrinho.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadCart();

    return () => {
      cancelled = true;
    };
  }, [cart, status]);
  

  // Função para remover um item
  const handleRemoveItem = (productId: string) => {
    setProcessing(true);
    setError(null);

    cart.removeItem(productId)
    .then(async response => {
      console.log('Status:', response.status);
  
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
  
      return cart.getCart();
    })
    .then(setItems)
    .catch(console.error);
  };

  const clearCart = async () => {
    setProcessing(true);
    setError(null);

    try {
      await cart.clearCart();
      setItems([]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erro ao limpar o carrinho.'
      );
    } finally {
      setProcessing(false);
    }
  };

  const makeOrder = async () => {
    try {
      const response = await fetch(`/api/account/cart/checkout`, {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/store/checkout');
      }
    } catch (error) {
      console.error('Erro ao realizar pedido. Detalhes: ', error);
    }
  }

  if (loading) {
    return <p>Carregando carrinho...</p>;
  }

  const emptyCart = items.length === 0;

  return (
    <div className="p-4 border rounded-md max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Seu Carrinho</h2>
      {emptyCart ? (
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
                onClick={() => handleRemoveItem(item.productId)}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      )}
      {
        status === 'authenticated' ? (
          <Button 
            disabled={emptyCart}
            onClick={makeOrder}
          >
            Ir para pagamento
          </Button>
        ) : (<>
          <p>Antes de concluir a compra, acesse seu perfil.</p>
          <Link
            href={`/auth?redirect=${encodeURIComponent("/store/cart")}`}
            className="bg-violet-600 text-white hover:bg-violet-700 px-5 py-2.5 rounded-lg font-semibold text-base"
          >
            Entrar
          </Link>
        </>)
      }
      
      <Button 
        disabled={emptyCart}
        onClick={clearCart}
      >
        Limpar carrinho
      </Button>
    </div>
  );
}