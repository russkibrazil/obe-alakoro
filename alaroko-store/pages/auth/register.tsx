import { FormError } from "@/components/forms/FormError";
import UserRegistrationForm from "@/components/forms/UserRegistrationForm";
import { useRouter } from "next/router";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string|null>(null);
  const handleSubmit = async (values: any, { setSubmitting, setStatus, setErrors }: any) => {
    setLoading(true);
    setError(null);
    const response = await fetch("/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    setSubmitting(false)
    setLoading(false);
    if (!response.ok) {
      setError("Não foi possível criar a conta.");
      return;
    }

    await router.push('/store');
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <UserRegistrationForm 
        submitFn={handleSubmit}
        initialData={{}}
        isSubmitting={loading}
      />
      {error && <FormError errorTxt={error} />}
    </main>
  );
}