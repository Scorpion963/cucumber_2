import { MessageStatusType } from "@/providers/types/user-store-provider-types";
import { Check, Clock } from "lucide-react";

export default function DisplayMessageStatus({
  status,
}: {
  status: MessageStatusType;
}) {
  function handleStatuses() {
    switch (status) {
      case "error":
        return <></>;
      case "read":
        return (
          <>
            <Check size={12} className="absolute left-1" />
            <Check size={12} className="" />
          </>
        );
      case "sent":
        return (
          <>
            <Check size={12} />
          </>
        );
      case "sending":
        return (
          <>
            <Clock size={12} />
          </>
        );
    }
  }
  return <div className="relative">{handleStatuses()}</div>;
}
