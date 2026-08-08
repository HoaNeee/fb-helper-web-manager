import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

type Props = {
  message?: string;
  title?: string;
  type?: "error" | "success" | "warning" | "info";
  showIcon?: boolean;
  outline?: boolean;
};

export default function AlertComponent({
  showIcon = false,
  message,
  title,
  type,
  outline = false,
}: Props) {
  const icons = {
    error: <AlertCircleIcon />,
    success: <AlertCircleIcon />,
    warning: <AlertCircleIcon />,
    info: <AlertCircleIcon />,
  };

  let cln = "";
  let clnTextDesc = "";

  if (outline) {
    if (type === "error") {
      cln = "text-red-500";
      clnTextDesc = "text-red-400";
    }
    if (type === "success") {
      cln = "text-green-500";
      clnTextDesc = "text-green-400";
    }
    if (type === "warning") {
      cln = "text-yellow-500";
      clnTextDesc = "text-yellow-400";
    }
    if (type === "info") {
      cln = "text-blue-500";
      clnTextDesc = "text-blue-400";
    }
  } else {
    if (type === "error") {
      cln = "bg-red-50 text-red-500 border-red-200";
      clnTextDesc = "text-red-400";
    }
    if (type === "success") {
      cln = "bg-green-50 text-green-500 border-green-200";
      clnTextDesc = "text-green-400";
    }
    if (type === "warning") {
      cln = "bg-yellow-50 text-yellow-500 border-yellow-200";
      clnTextDesc = "text-yellow-400";
    }
    if (type === "info") {
      cln = "bg-blue-50 text-blue-500 border-blue-200";
      clnTextDesc = "text-blue-400";
    }
  }

  return (
    <Alert className={`text-sm ${cln}`}>
      {showIcon && icons[type]}
      {title ? <AlertTitle>{title}</AlertTitle> : null}
      {message ? (
        <AlertDescription className={`text-xs ${clnTextDesc}`}>
          {message}
        </AlertDescription>
      ) : null}
    </Alert>
  );
}
