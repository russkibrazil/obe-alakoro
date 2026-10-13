import { Address, Entrega } from "@/generated/prisma/client";
import { CommonFormProps } from "../CommonFormData";
import FormSubmitButton from "./formikControls/FormSubmitButton";
import FormTextInput from "./formikControls/Text";
import { Formik, Form } from 'formik';
import Select from "../common/Select";

interface DeliveryFormProps extends CommonFormProps<Entrega> {
  userAddresses: Address[];
}

export default function EntregaForm({
  userAddresses,
  submitFn,
  isSubmitting,
  initialData
}: DeliveryFormProps) {
  return (
    <Formik
      initialValues={initialData}
      // validationSchema={validationSchema}
      onSubmit={submitFn}
    >
      {({ setValues, values }) => (
        <Form className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Endereço de entrega
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Escolha um endereço salvo ou informe um novo.
            </p>
          </div>

          {/* Seleção de endereço salvo */}
          {userAddresses.length > 0 && (
            <Select
              id="savedAddress"
              label="Usar endereço salvo"
              defaultValue=""
              onChange={(event) => {
                const selectedAddress = userAddresses.find(
                  (address) => address.id === event.target.value
                );

                if (!selectedAddress) {
                  return;
                }

                setValues({
                  endereco: selectedAddress.street,
                  numero: selectedAddress.number,
                  complemento: selectedAddress.complement ?? "",
                  bairro: selectedAddress.neighborhood,
                  cidade: selectedAddress.city,
                  estado: selectedAddress.state,
                  cep: selectedAddress.zipCode,
                });
              }}
            >
              <option value="" disabled>
                Selecione um endereço
              </option>

              {userAddresses.map((address) => (
                <option key={address.id} value={address.id}>
                  {address.label || address.street}
                  {" — "}
                  {address.city}/{address.state}
                  {address.isDefault ? " (Principal)" : ""}
                </option>
              ))}
            </Select>
          )}

          {/* Campos do endereço */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormTextInput
              inputName="cep"
              labelText="CEP"
              required
            />

            <FormTextInput
              inputName="endereco"
              labelText="Endereço"
              required
            />

            <FormTextInput
              inputName="numero"
              labelText="Número"
              required
            />

            <FormTextInput
              inputName="complemento"
              labelText="Complemento"
            />

            <FormTextInput
              inputName="bairro"
              labelText="Bairro"
              required
            />

            <FormTextInput
              inputName="cidade"
              labelText="Cidade"
              required
            />

            <FormTextInput
              inputName="estado"
              labelText="Estado (UF)"
              required
            />
          </div>

          <p className="text-xs text-gray-500">
            Os campos marcados com * são obrigatórios.
          </p>

          <div className="flex justify-end border-t border-gray-200 pt-4">
            <FormSubmitButton disabled={isSubmitting} isSubmitting={isSubmitting}/>
          </div>
        </Form>
      )}
    </Formik>
  );
}