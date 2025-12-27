import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

export default function SidebarItem({
  icon,
  header,
  label,
  onClick
}: {
  icon: ReactNode;
  label: string;
  header: string;
  onClick: () => void
}) {
  return (
    <Button onClick={onClick} variant={'ghost'} className="flex justify-start items-center gap-4 px-6 cursor-pointer py-8 w-full">
      <div>{icon}</div>
      <div className="flex flex-col items-start">
        <div>{header}</div>
        <div className="text-muted-foreground">{label}</div>
      </div>
    </Button>
  );
}
