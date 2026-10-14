import { Formik, Form } from "formik";
import Link from "next/link";
import FormSubmitButton from "./formikControls/FormSubmitButton";
import FormTextInput from "./formikControls/Text";
import { CommonFormProps } from "../CommonFormData";

// const validationSchema = Yup.object({
//   email: Yup.string()
//     .trim()
//     .email("Informe um e-mail válido.")
//     .required("O e-mail é obrigatório."),

//   password: Yup.string()
//     .required("A senha é obrigatória."),
// });


export default function LoginForm({ initialData, submitFn, isSubmitting }: CommonFormProps<{email: string; password: string;}>) {
  return (
    <Formik
      initialValues={initialData}
      // validationSchema={validationSchema}
      onSubmit={submitFn}
    >
      {() => (
        <Form className="space-y-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Entrar na sua conta
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Informe seu e-mail e sua senha para continuar.
            </p>
          </div>

          <FormTextInput
            labelText="Seu e-mail"
            inputName="email"
            required
          />

          <FormTextInput
            labelText="Senha"
            inputName="password"
            required
          />

            {/* <div className="mt-2 text-right">
              <a
                href="/forgot-password"
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Esqueci minha senha
              </a>
              
            </div> */}

          <FormSubmitButton isSubmitting={isSubmitting} disabled={isSubmitting} label="Entrar" />

          <p className="text-center text-sm text-gray-600">
            Ainda não tem uma conta?{" "}
            <Link
              href="/auth/register"
              className="font-medium text-blue-600 hover:text-blue-800"
            >
              Cadastre-se
            </Link>
          </p>
        </Form>
      )}
    </Formik>
  );
}