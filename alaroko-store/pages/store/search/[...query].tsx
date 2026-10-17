import { CardProduct } from "@/components/cards/CardProduct";
import { Product } from "@/generated/prisma/client";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { CustomerCartManagement } from '@/services/cartManagement';
import { useSession } from "next-auth/react";
import { AnonymousCartProduct } from "@/store/cartStore";

export default function SearchResultsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [addingId, setAddingId] = useState<string | null>(null);
  const {status} = useSession();
  const cart = useMemo(
    () => new CustomerCartManagement(status === 'authenticated'),
    [status]
  );
  const searchKey = router.query.query;

  useEffect(() => {
    if (!router.isReady) return;
    setLoading(true);
    fetch(`/api/products?name=${searchKey}`)
      .then(response => response.json())
      .then(setProducts);

    setLoading(false);
  }, [router.isReady, searchKey]);

  const handleAddToCart = async (productData: AnonymousCartProduct) => {
    setAddingId(productData.id);
    cart.addItem(addingId, 1, productData)
    setAddingId(null);
  };

  if (loading) return <>Carregando...</>
  if (products.length === 0) return <>Nenhum produto encontrado</>;

  return <div className="max-w-6xl mx-auto p-6">
    <h1 className="text-3xl font-bold mb-6">Catálogo de Produtos</h1>
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
  </div>
}