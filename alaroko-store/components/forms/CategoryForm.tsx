import { Formik, Form } from 'formik';
import { CommonFormProps } from '../CommonFormData';
import { FunctionComponent } from 'react';
import { Categoria } from '@/generated/prisma/client';
import FormTextInput from './formikControls/Text';
import FormSubmitButton from './formikControls/FormSubmitButton';

export const CategoryForm: FunctionComponent<CommonFormProps<Categoria>> = ({
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
        inputName='slug'
        labelText='Slug'
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