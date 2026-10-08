import { FunctionComponent } from "react";

interface FormErrorProps {
  errorTxt: string;
}

export const FormError: FunctionComponent<FormErrorProps> = ({errorTxt}) => (
  <div className="mt-4 p-4 rounded-md bg-red-100 text-red-700 border border-red-400">{errorTxt}</div>
)