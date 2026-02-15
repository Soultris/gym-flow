/**
 * Extract a human-readable error message from an RTK Query error response.
 * The backend returns errors in the shape: { error: "message" }
 */
export function getErrorMessage(
  error: unknown,
  fallback: string = "An unexpected error occurred"
): string {
  if (error && typeof error === "object") {
    const err = error as {
      data?: { error?: string; message?: string };
      message?: string;
    };
    return err?.data?.error || err?.data?.message || err?.message || fallback;
  }
  return fallback;
}
