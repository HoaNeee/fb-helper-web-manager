import toastHepler from "@/helpers/toast-helper";

export type ApiResponseCode =
  | "SYSTEM"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "UNAUTHORIZED"
  | "INTERNAL_ERROR"
  | "UNKNOWN"
  | "BAD_CREDENTIAL"
  | "TOKEN_EXPIRED"
  | "CONFLICT";

export class CustomError extends Error {
  code: ApiResponseCode;
  name: string;
  status?: number;
  constructor(
    code: ApiResponseCode = "SYSTEM",
    message: string,
    status?: number,
    name?: string,
  ) {
    super(message);
    this.code = code || "SYSTEM"; // SYSTEM is FE not from API
    this.name = name || "CustomError";
    this.status = status;
  }
}

export function handleExceptionGlobal(
  error: CustomError,
  msg: string,
  showToast = true,
) {
  if (showToast) {
    toastHepler({ message: msg, type: "error" });
  }
  console.error(error);
}

export function getExceptionText(error: CustomError) {
  if (error.code === "SYSTEM") {
    return {
      vi: "Đã có lỗi xảy ra, vui lòng thử lại sau.",
      en: "Something went wrong, please try again later.",
    };
  }

  return { vi: error.message, en: error.message };
}
