import { useState } from "react";
import { useRouter } from "next/router";
import LoginForm from "@/components/forms/LoginForm";
import { FormError } from "@/components/forms/FormError";
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (values: any, { setSubmitting, setStatus, setErrors }: any) => {
    setError(null);
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (!result || result.error) {
        setError('Credenciais inválidas.');
        return;
      }

      const redirect = router.query.redirect;

      const destination =
        typeof redirect === 'string' &&
        redirect.startsWith('/') &&
        !redirect.startsWith('//')
          ? redirect
          : '/account';

      await router.replace(destination);
    } catch {
      setError('Não foi possível realizar o login.');
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-sm sm:p-8">
        <LoginForm
          submitFn={handleSubmit}
          isSubmitting={loading}
          initialData={{}}
        />

        {error && <FormError errorTxt={error} />}
      </div>
    </main>
  );
}