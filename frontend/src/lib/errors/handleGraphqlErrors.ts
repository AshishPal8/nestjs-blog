import {
  CombinedGraphQLErrors,
  ServerError,
  ServerParseError,
} from "@apollo/client/errors";

import { toast } from "sonner";
import { ZodError } from "zod";

export function handleGraphqlError(err: any) {
  // GraphQL errors
  if (CombinedGraphQLErrors.is(err)) {
    const message = err.errors[0].message;
    toast.error(message);
    return;
  }

  // Network errors
  if (ServerError.is(err)) {
    toast.error("Network error. Please check your connection.");
    return;
  }

  // Zod validation errors
  if (err instanceof ZodError) {
    const first = err.issues?.[0];
    const message = first
      ? `${first.path.join(".") || "field"} ${first.message}`
      : "Invalid input";
    toast.error(message);
    return;
  }

  if (ServerParseError.is(err)) {
    toast.error(err.message);
    return;
  }

  // Generic errors
  if (err?.message) {
    toast.error(err.message);
    return;
  }
  // Fallback
  toast.error("Something went wrong");
}
