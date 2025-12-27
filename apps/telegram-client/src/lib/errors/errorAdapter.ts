import { authClient } from "@/lib/auth-client";
import { EXTENDED_ERRORS_TYPE } from "@/types/APIErrorTypes";

type FormField = "email" | "password" | "name" | "root" | "username";

type ResolvedField = readonly FormField[];

export const ERROR_FIELD_MAP: Partial<
  Record<keyof EXTENDED_ERRORS_TYPE, readonly FormField[]>
> = {
  INVALID_EMAIL: ["email"],
  INVALID_EMAIL_OR_PASSWORD: ["email", "password"],
  INVALID_PASSWORD: ["password"],
  PASSWORD_TOO_LONG: ["password"],
  PASSWORD_TOO_SHORT: ["password"],
  USER_ALREADY_EXISTS: ["email"],
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: ["email"],
  USER_NOT_FOUND: ["email"],
  USERNAME_TAKEN: ["username"],
};

export function getFieldError(errorCode: string): ResolvedField;
export function getFieldError(
  errorCode: keyof typeof authClient.$ERROR_CODES
): ResolvedField;
export function getFieldError(errorCode: string): ResolvedField {
  return ERROR_FIELD_MAP[errorCode as keyof EXTENDED_ERRORS_TYPE] ?? ["root"];
}
