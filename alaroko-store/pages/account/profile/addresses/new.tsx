import Button from "@/components/common/Button";
import { AddressForm } from "@/components/forms/AddressForm";
import { FormError } from "@/components/forms/FormError";
import { withAuthorization } from "@/components/withAuthorization";
import { Address } from "@/generated/prisma/client";
import { useRouter } from "next/router";
import { useState } from "react";

function EditProfileAddress() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const[error, setError] = useState<string|null>(null)

  const handleSubmit = async (values: any, { setSubmitting, setStatus, setErrors }: any) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/account/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error('Não foi possível cadastrar a categoria.')
      }

      await router.push('/account/profile/addresses')
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

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <Button
            onClick={() => router.push('/account/profile/addresses')}
            variant="secondary"
          >
            ← Voltar para endereços
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            Criar Endereço
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Insira seu endereço para agilizar o fechamento de suas compras.
          </p>
        </header>
        <AddressForm initialData={{} as Address} submitFn={handleSubmit} isSubmitting={loading} />
        {error && <FormError errorTxt={error} />}
      </div>
    </main>
  )
}

export default withAuthorization(EditProfileAddress, ["ROLE_ADMIN", "ROLE_USER"]);
