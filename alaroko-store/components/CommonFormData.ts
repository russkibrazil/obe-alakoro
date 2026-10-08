export interface CommonFormProps<T> {
  submitFn: (values: any|Partial<T>, { setSubmitting, setStatus, setErrors }: any) => void
  isSubmitting: boolean;
  initialData: Partial<T>;
}