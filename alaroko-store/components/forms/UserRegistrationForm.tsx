import { Formik, Form } from "formik";
// import * as Yup from "yup";
import { CommonFormProps } from "../CommonFormData";
import { User } from "@/generated/prisma/client";
import FormTextInput from "./formikControls/Text";
import FormSubmitButton from "./formikControls/FormSubmitButton";

export interface UserRegistrationValues {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

// const validationSchema = Yup.object({
//   name: Yup.string()
//     .trim()
//     .min(3, "Informe seu nome completo.")
//     .required("O nome é obrigatório."),

//   email: Yup.string()
//     .trim()
//     .email("Informe um e-mail válido.")
//     .required("O e-mail é obrigatório."),

//   cpf: Yup.string()
//     .required("O CPF é obrigatório.")
//     .test("valid-cpf", "Informe um CPF válido.", (value) =>
//       value ? isValidCpf(value) : false
//     ),

//   phone: Yup.string()
//     .required("O telefone é obrigatório.")
//     .test("valid-phone", "Informe um telefone válido.", (value) => {
//       const digits = value?.replace(/\D/g, "") ?? "";
//       return digits.length === 10 || digits.length === 11;
//     }),

//   password: Yup.string()
//     .min(8, "A senha deve ter pelo menos 8 caracteres.")
//     .required("A senha é obrigatória."),

//   confirmPassword: Yup.string()
//     .required("Confirme sua senha.")
//     .oneOf([Yup.ref("password")], "As senhas não coincidem."),
// });

const inputClassName =
  "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm " +
  "shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 " +
  "focus:ring-blue-500";

const labelClassName = "block text-sm font-medium text-gray-700";

const errorClassName = "mt-1 text-sm text-red-600";

function formatCpf(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) {
    return digits.length ? `(${digits}` : "";
  }

  if (digits.length <= 6) {
    return digits.replace(/^(\d{2})(\d+)/, "($1) $2");
  }

  if (digits.length <= 10) {
    return digits.replace(/^(\d{2})(\d{4})(\d+)/, "($1) $2-$3");
  }

  return digits.replace(/^(\d{2})(\d{5})(\d+)/, "($1) $2-$3");
}

function isValidCpf(value: string): boolean {
  const cpf = value.replace(/\D/g, "");

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  for (let position = 9; position < 11; position++) {
    let sum = 0;

    for (let i = 0; i < position; i++) {
      sum += Number(cpf[i]) * (position + 1 - i);
    }

    const remainder = (sum * 10) % 11;
    const digit = remainder === 10 ? 0 : remainder;

    if (digit !== Number(cpf[position])) {
      return false;
    }
  }

  return true;
}

export default function UserRegistrationForm({
  submitFn,
  isSubmitting,
  initialData
}: CommonFormProps<User>) {
  return (
    <Formik
      initialValues={initialData}
      // validationSchema={validationSchema}
      onSubmit={async (values, helpers) => {
        try {
          await onSubmit({
            name: values.name.trim(),
            email: values.email.trim(),
            cpf: values.cpf.replace(/\D/g, ""),
            phone: values.phone.replace(/\D/g, ""),
            password: values.password,
            confirmPassword: values.confirmPassword,
          });
        } catch {
          helpers.setStatus(
            "Não foi possível realizar o cadastro. Tente novamente."
          );
        }
      }}
    >
      {({ status, setFieldValue }) => (
        <Form className="space-y-5">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Criar conta
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Preencha seus dados para criar sua conta.
            </p>
          </div>

          {/* Nome */}
          <FormTextInput
            inputName="name"
            labelText="Nome"
            required
          />

          {/* E-mail */}
          <FormTextInput
            inputName="email"
            labelText="E-mail"
            required
          />

          {/* CPF */}
          <FormTextInput
            inputName="cpf"
            labelText="CPF"
            required
          />

          {/* Telefone */}
          <FormTextInput
            labelText="Celular"
            inputName="phone"
            required
          />

          {/* Senha */}
          <FormTextInput
            inputName="password"
            labelText="Senha"
            required
          />
          {/* Confirmação da senha */}
          <FormTextInput
            inputName="confirmPassword"
            labelText="Confirme a Senha"
            required
          />

          <FormSubmitButton
            disabled={isSubmitting}
            isSubmitting={isSubmitting}
            label="Criar Conta"
            />
        </Form>
      )}
    </Formik>
  );
}