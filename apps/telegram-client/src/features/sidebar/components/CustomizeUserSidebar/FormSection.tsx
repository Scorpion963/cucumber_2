import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default  function FormSection({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("p-6 space-y-4", className)}>{children}</div>;
}