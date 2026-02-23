import axios from "axios";
import { toast } from "sonner";
import { ZodError } from "zod";

export function handleError(err: unknown, opts?: { toastOnNetwork?: boolean }) {
  const toastOnNetwork = opts?.toastOnNetwork ?? true;

  console.log(err);

  if (axios.isAxiosError(err)) {
    const aerr = err;
    const data = aerr.response?.data;

    const msgFromData =
      (data && (data.message || data.error || data.msg || data.message?.[0])) ??
      undefined;

    const message =
      msgFromData ||
      aerr.response?.statusText ||
      aerr.message ||
      "Request failed";

    toast.error(String(message));
    return String(message);
  }

  if (err instanceof ZodError) {
    const first = err.issues?.[0];
    const message = first
      ? `${first.path.join(".") || "field"} ${first.message}`
      : "Invalid input";
    toast.error(message);
    return message;
  }

  if (err instanceof Error) {
    const message = err.message || "An error occurred";
    // network errors often have message 'Network Error' or 'timeout'
    if (toastOnNetwork) toast.error(message);
  }

  const fallback = "Something went wrong";
  toast.error(fallback);
  return fallback;
}
