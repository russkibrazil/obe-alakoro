import { FormError } from "@/components/forms/FormError";
import { UserForm } from "@/components/forms/UserForm";
import { withAuthorization } from "@/components/withAuthorization";
import { User } from "@/generated/prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function EditProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [profile, setProfile] = useState<User|null>(null);
  const [error, setError] = useState<string|null>(null);
  useEffect(() => {
    setLoading(true);
    fetch(`/api/users/${'###'}`)
      .then(response => response.json())
      .then(setProfile);
    setLoading(false);
  }, [router.isReady]);

  const handleSubmit = async (values: any, { setSubmitting, setStatus, setErrors }: any) => {
    setLoading(true)
    setError('');

    try {
      const response = await fetch(`/api/users/${'#...'}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error('Não foi possível cadastrar a categoria.')
      }

      await router.push('/account')
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

  if (profile === null) {
    return <>Not found</>
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link
            href="/account"
            className="text-sm text-purple-600 hover:underline"
          >
            ← Voltar para minha conta
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-gray-800">
            Meu perfil
          </h1>

          <p className="mt-2 text-gray-600">
            Modifique seus dados básicos
          </p>
        </div>
        <UserForm initialData={profile} submitFn={handleSubmit} isSubmitting={loading}/>
        {error && <FormError errorTxt={error} />}
      </div>
    </main>
  );
}

export default withAuthorization(EditProfile, ["ROLE_ADMIN", "ROLE_USER"]);
