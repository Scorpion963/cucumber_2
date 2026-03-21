import { MessageStatusType } from "@/providers/types/user-store-provider-types";
import { Check, Clock } from "lucide-react";

export default function DisplayMessageStatus({
  status,
}: {
  status: MessageStatusType;
}) {
  return (
    <div className="relative">
      {status === "read" ? (
        <>
          <Check size={12} className="absolute left-1" />
          <Check size={12} />
        </>
      ) : status === "sending" ? (
        <>
          <Clock size={12} />
        </>
      ) : (
        status === "sent" && (
          <>
            <Check size={12} />
          </>
        )
      )}
    </div>
  );
}
