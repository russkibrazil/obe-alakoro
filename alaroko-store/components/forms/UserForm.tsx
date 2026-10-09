import { Formik, Form } from 'formik';
import { CommonFormProps } from '../CommonFormData';
import { FunctionComponent } from 'react';
import { User } from '@/generated/prisma/client';
import FormTextInput from './formikControls/Text';
import FormSubmitButton from './formikControls/FormSubmitButton';

export const UserForm: FunctionComponent<CommonFormProps<User>> = ({
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
        inputName='name'
        labelText='Nome'
        required
      />
      <FormTextInput
        inputName='cpf'
        labelText='CPF'
        required
      />
      <FormTextInput
        inputName='phone'
        labelText='Celular'
        required
      />
      <FormTextInput
        inputName='email'
        labelText='E-mail'
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