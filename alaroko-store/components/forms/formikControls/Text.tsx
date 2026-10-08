import { ErrorMessage, Field } from "formik";
import { FunctionComponent } from "react";
import { FormTextInputProps } from "./CommonFormikInput";

const FormTextInput: FunctionComponent<FormTextInputProps> = ({inputName, labelText, required = false}) => {
  const fieldName = `${inputName}-input`
  return (
    <div className="mb-4">
      <label 
        htmlFor={fieldName}
        className="block text-sm font-medium text-gray-700"
      >
        {labelText}
      </label>
      <Field
        id={fieldName}
        type="text"
        name={inputName}
        required={required}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500 p-2"
      />
      <ErrorMessage
        name={inputName}
        component="div"
        className="text-red-600 text-sm mt-1"
      />
    </div>
  );
}

export default FormTextInput;