import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { getFieldError } from "./errorAdapter";

export function handleFieldErrors<T extends FieldValues>(
  error: { code: string; message: string },
  form: UseFormReturn<T>
) {
  const fields = getFieldError(error.code);
  for (const field of fields) {
    const values = form.getValues();
    if (field in values) {
      form.setError(field as Path<T>, { message: error.message });
    } else {
      form.setError("root", { message: error.message });
    }
  }
}
