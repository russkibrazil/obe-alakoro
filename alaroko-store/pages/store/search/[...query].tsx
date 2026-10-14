import { CardProduct } from "@/components/cards/CardProduct";
import { Product } from "@/generated/prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function SearchResultsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const searchKey = router.query.query;

  useEffect(() => {
    if (typeof searchKey !== 'string') return;
    setLoading(true);
    fetch(`/api/products?name=${searchKey}`)
      .then(response => response.json())
      .then(setProducts);

    setLoading(false);
  }, [router.isReady]);

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
        />
      ))}
    </div>
  </div>
}