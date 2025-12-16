import { authClient } from "@/lib/auth-client";

type FormField = "email" | "password" | "name" | "root";

type ResolvedField = readonly FormField[]

type ERROR_CODES_KEYS = keyof typeof authClient.$ERROR_CODES

export const ERROR_FIELD_MAP: Partial<
  Record<keyof typeof authClient.$ERROR_CODES, readonly FormField[]>
> = {
  INVALID_EMAIL: ["email"],
  INVALID_EMAIL_OR_PASSWORD: ["email", "password"],
  INVALID_PASSWORD: ["password"],
  PASSWORD_TOO_LONG: ["password"],
  PASSWORD_TOO_SHORT: ["password"],
  USER_ALREADY_EXISTS: ["email"],
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: ["email"],
  USER_NOT_FOUND: ["email"],
};

export function getFieldError(errorCode: string): ResolvedField;
export function getFieldError(errorCode: keyof typeof authClient.$ERROR_CODES): ResolvedField;
export function getFieldError(errorCode: string): ResolvedField {
  return ERROR_FIELD_MAP[errorCode as ERROR_CODES_KEYS] ?? ["root"];
}


