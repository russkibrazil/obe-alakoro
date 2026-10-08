import { ErrorMessage, Field } from "formik";
import { FunctionComponent } from "react";
import { FormSelectInputProps } from "./CommonFormikOptionsInput";

const FormSelectableInput: FunctionComponent<FormSelectInputProps> = ({
  inputName,
  labelText,
  required = false,
  options,
  type,
  allowMultiple = false
}) => {
  const fieldName = `${inputName}-input`
  if (type === "radio") {
    return <></>
  }

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
        as="select"
        name={inputName}
        required={required}
        multiple={allowMultiple}
        className="w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500 p-2"
      >
        {options.map((option) => {return (<option value={option.value}>{option.label}</option>);})}
      </Field>

      <ErrorMessage
        name={inputName}
        component="div"
        className="text-red-600 text-sm mt-1"
      />
    </div>
  );
}

export default FormSelectableInput;