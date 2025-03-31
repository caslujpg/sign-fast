import { cn } from "@/lib/utils";
import { LuEye, LuPen } from "react-icons/lu";

type StatusBadgeProps = {
  status: "PENDING" | "SIGNED";
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "flex px-4 py-2 gap-2 items-center justify-center text-sm font-semibold rounded-full border",
        status === "SIGNED"
          ? "bg-green-100 text-green-800"
          : "bg-yellow-100 text-yellow-800"
      )}
    >
      {status === "SIGNED" ? <LuEye size={14} /> : <LuPen size={14} />}
      {status === "SIGNED" ? "Assinado" : "Pendente"}
    </span>
  );
}