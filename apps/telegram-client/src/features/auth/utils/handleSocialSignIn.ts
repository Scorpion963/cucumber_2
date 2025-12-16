import { authClient } from "@/lib/auth-client";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { handleFieldErrors } from "./handleFieldErrors";

export async function handleSocialSignIn<T extends FieldValues>(
  provider: "google" | "github",
  form?: UseFormReturn<T>
) {
  const { data, error } = await authClient.signIn.social({
    provider: provider,
  });

  if (!form) return;

  if (error?.code && error.message) {
    handleFieldErrors({ code: error.code, message: error.message }, form);
  }
}
