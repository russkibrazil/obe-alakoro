import { useState } from "react";
import { useRouter } from "next/router";
import LoginForm from "@/components/forms/LoginForm";
import { FormError } from "@/components/forms/FormError";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (values: any, { setSubmitting, setStatus, setErrors }: any) => {
    setError(null);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      if (response.status === 401) {
        setError("Credenciais inválidas.");
      }

      setError("Não foi possível realizar o login.");
      setLoading(false);
      setSubmitting(false);
      return;
    }

    // Se o backend utilizar cookie de sessão ou JWT HttpOnly,
    // não é necessário armazenar o token no JavaScript.
    const redirect = router.query.redirect;

    const destination =
      typeof redirect === "string" && redirect.startsWith("/") &&
      !redirect.startsWith("//")
        ? redirect
        : "/account";

    setLoading(false);
    setSubmitting(false);
    await router.replace(destination);
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