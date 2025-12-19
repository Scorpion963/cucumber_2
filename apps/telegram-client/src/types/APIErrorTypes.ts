import { authClient } from "@/lib/auth-client";

export const EXTENDED_ERRORS = {
  USERNAME_TAKEN: "Username taken",
} as const;

type ADDITIONAL_ERRORS_TYPE = typeof EXTENDED_ERRORS;

export type EXTENDED_ERRORS_TYPE = typeof authClient.$ERROR_CODES &
  ADDITIONAL_ERRORS_TYPE;
