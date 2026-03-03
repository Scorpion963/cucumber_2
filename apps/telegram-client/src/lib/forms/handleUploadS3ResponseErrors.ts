import { ReasonPhrases } from "http-status-codes";
import { FieldValues, UseFormReturn } from "react-hook-form";

export default function handleUploadS3ResponseErrors<T extends FieldValues>(
  errorCode: string,
  form: UseFormReturn<T>,
) {
  switch (errorCode) {
    case ReasonPhrases.UNAUTHORIZED:
      form.setError("root", {
        message: "You must be logged in to update this information",
      });
      return;
    case ReasonPhrases.UNPROCESSABLE_ENTITY:
      form.setError("root", { message: "Invalid content type" });
      return;
    default:
      form.setError("root", {
        message: "Unexpected error happened, please try again later",
      });
  }
}