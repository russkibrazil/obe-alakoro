import Button from "@/components/common/Button";
import { AddressForm } from "@/components/forms/AddressForm";
import { FormError } from "@/components/forms/FormError";
import { Address } from "@/generated/prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export function EditProfileAddress() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [address, setAddress] = useState<Address|null>(null);
  const[error, setError] = useState<string|null>(null)

  useEffect(() => {
    const id = router.query.id;
    if (router.isReady || typeof id !== 'string') {
      return;
    }
    setLoading(true);
    fetch(`/api/addresses/${"#..."}`)
      .then(response => response.json())
      .then(setAddress);
    setLoading(false);
  }, [router.isReady]);

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

  if (address === null) {
    return <>Not found</>
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <Button
            onClick={() => router.push('/admin/categories')}
            variant="secondary"
          >
            ← Voltar para endereços
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            MOdificar Endereço
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Atualize seu endereço para agilizar o fechamento de suas compras.
          </p>
        </header>
        <AddressForm initialData={address} submitFn={handleSubmit} isSubmitting={loading} />
        {error && <FormError errorTxt={error} />}
      </div>
    </main>
  )
}