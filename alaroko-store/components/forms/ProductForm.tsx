import { Formik, Form } from 'formik';
import { CommonFormProps } from '../CommonFormData';
import { FunctionComponent } from 'react';
import { Categoria, Product } from '@/generated/prisma/client';
import FormTextInput from './formikControls/Text';
import FormSubmitButton from './formikControls/FormSubmitButton';
import FormSelectableInput from './formikControls/Select';
import Checkbox from '../common/Checkbox';

interface ProductFormProps extends CommonFormProps<Product> {
  categories: Categoria[];
}

export const ProductForm: FunctionComponent<ProductFormProps> = ({
  submitFn,
  isSubmitting,
  initialData,
  categories
}) => {
  return (
    <Formik
      initialValues={initialData}
      enableReinitialize
      onSubmit={submitFn}
    >
      {({ values, errors, touched, setFieldValue }) => (
        <Form>
          <FormTextInput
            inputName="name"
            labelText="Nome"
            required
          />

          <FormTextInput
            inputName="description"
            labelText="Descrição"
            required
          />

          <FormTextInput
            inputName="price"
            labelText="Preço"
            required
            // type="number"
          />

          <FormTextInput
            inputName="stock"
            labelText="Estoque"
            required
            // type="number"
          />

          <FormTextInput
            inputName="sku"
            labelText="SKU"
          />

          <FormTextInput
            inputName="image"
            labelText="Imagem"
          />

          <FormSelectableInput
            labelText="Categoria"
            inputName='categoriaId'
            type='select'
            required
            options={categories.map(c=>{return {value: c.id, label: c.name}})}
          />

          <Checkbox
            id="active"
            label="Produto ativo"
            checked={values.active}
            onChange={(value) => setFieldValue('active', value)}
          />

          <FormSubmitButton 
            isSubmitting={isSubmitting}
            label='Salvar'
            disabled={isSubmitting}
          />
        </Form>
      )}
    </Formik>
  );
};