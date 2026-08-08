export type ApiResponseCode =
  | "SYSTEM"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "UNAUTHORIZED"
  | "INTERNAL_ERROR"
  | "UNKNOWN"
  | "BAD_CREDENTIAL";

export class CustomError extends Error {
  code: ApiResponseCode;
  name: string;
  constructor(
    code: ApiResponseCode = "SYSTEM",
    message: string,
    name?: string,
  ) {
    super(message);
    this.code = code || "SYSTEM"; // SYSTEM is FE not from API
    this.name = name || "CustomError";
  }
}

class ValidateException extends CustomError {
  constructor(message: string) {
    super("SYSTEM", message, "ValidateException");
  }
}

export function handleExceptionGlobal(error) {
  console.log(error);
}
