import { FormTextInputProps } from "./CommonFormikInput";

export interface FormSelectInputProps extends FormTextInputProps {
  options: {value: string; label: string;}[];
  type: "select" | "radio";
  allowMultiple?: boolean;
}