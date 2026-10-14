import { useEffect, useState } from "react";
import DeliveryForm from "../../components/forms/DeliveryForm";
import { Address } from "@/generated/prisma/client";
import { FormError } from "@/components/forms/FormError";
import { useRouter } from "next/router";

export default function CheckoutPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchAddresses() {
      setLoading(true)
      try {
        const response = await fetch("/api/addresses", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Não foi possível carregar os endereços salvos.");
        }

        const data: Address[] = await response.json();
        setAddresses(data);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        setError(
          error instanceof Error
            ? error.message
            : "Ocorreu um erro ao carregar os endereços."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchAddresses();

    return () => controller.abort();
  }, []);

  const handleSubmit = async (values: any, { setSubmitting, setStatus, setErrors }: any) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/addresses/${'#...'}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error('Não foi possível cadastrar a categoria.')
      }

      await router.push('/profile/addresses')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ocorreu um erro ao cadastrar.'
      )
    } finally {
      setLoading(false)
      setSubmitting(false)
    }
  }

  if (loading) {
    return ( 
    <main className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Finalizar pedido
        </h1>
      </header>
      <p className="text-sm text-gray-500">
        Carregando seus endereços...
      </p>
    </main>);
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Finalizar pedido
        </h1>

        <p className="mt-2 text-gray-600">
          Informe onde deseja receber sua compra.
        </p>
      </header>

      <DeliveryForm
        submitFn={handleSubmit}
        isSubmitting={loading}
        initialData={{} as Address}
        userAddresses={addresses}
      />
      {error && <FormError errorTxt={error} />}
    </main>
  );
}