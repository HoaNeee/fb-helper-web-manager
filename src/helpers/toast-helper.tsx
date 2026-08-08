import { toast } from "@/components/ui/toast";

type Props = {
  message: string;
  type?: "default" | "success" | "info" | "warning" | "error";
  priority?: "low" | "high";
};

export default function toastHepler({ message, type, priority }: Props) {
  if (type === "success") {
    return toast.add({
      type: type ?? "default",
      description: <span className="text-green-600">{message}</span>,
      priority: (priority as "low" | "high") || "high",
    });
  }
  if (type === "info") {
    return toast.add({
      type: type ?? "default",
      description: <span className="text-blue-600">{message}</span>,
      priority: (priority as "low" | "high") || "high",
    });
  }
  if (type === "warning") {
    return toast.add({
      type: type ?? "default",
      description: <span className="text-yellow-600">{message}</span>,
      priority: (priority as "low" | "high") || "high",
    });
  }
  if (type === "error") {
    return toast.add({
      type: type ?? "default",
      description: <span className="text-red-600">{message}</span>,
      priority: (priority as "low" | "high") || "high",
    });
  }

  return toast.add({
    type: type ?? "default",
    description: message,
    priority: (priority as "low" | "high") || "high",
  });
}
