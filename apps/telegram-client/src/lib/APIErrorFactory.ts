import "server-only";

import { EXTENDED_ERRORS_TYPE } from "@/types/APIErrorTypes";
import { APIError, statusCodes } from "better-auth";

export function throwAPIError(
  statusCode: keyof typeof statusCodes,
  error?: {
    message?: string;
    code?: keyof EXTENDED_ERRORS_TYPE;
    cause?: unknown;
  }
) {
  throw new APIError(statusCode, error);
}
