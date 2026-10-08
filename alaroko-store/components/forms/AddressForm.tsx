import { Formik, Form } from 'formik';
import { CommonFormProps } from '../CommonFormData';
import { FunctionComponent } from 'react';
import { Address } from '@/generated/prisma/client';
import FormTextInput from './formikControls/Text';
import FormSubmitButton from './formikControls/FormSubmitButton';

export const AddressForm: FunctionComponent<CommonFormProps<Address>> = ({
  submitFn,
  isSubmitting,
  initialData
}) => {
  return (<Formik
    initialValue={initialData}
    onSubmit={submitFn}
  >
    <Form>
      <FormTextInput
        inputName='label'
        labelText='Identificação do endereço'
      />
      <FormTextInput
        inputName='street'
        labelText='Logradouro'
        required
      />
      <FormTextInput
        inputName='number'
        labelText='Número'
        required
      />
      <FormTextInput
        inputName='complement'
        labelText='Complement'
      />
      <FormTextInput
        inputName='neighborhood'
        labelText='Bairro'
        required
      />
      <FormTextInput
        inputName='city'
        labelText='Cidade'
        required
      />
      <FormTextInput
        inputName='state'
        labelText='Estado'
        required
      />
      <FormTextInput
        inputName='zipCode'
        labelText='CEP'
        required
      />
      <FormTextInput
        inputName='recipientName'
        labelText='Responsável'
        required
      />
      <FormSubmitButton 
        isSubmitting={isSubmitting}
        label='Salvar'
        disabled={isSubmitting}
      />
    </Form>
  </Formik>);
}