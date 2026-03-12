"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { ChatBodyWrapper } from "../ChatClient";

export default function ChatInput() {
  return (
    <ChatBodyWrapper>
      <div className="w-full h-full pt-2 flex gap-2">
        <Input className="rounded-full" />
        <SendButton />
      </div>
    </ChatBodyWrapper>
  );
}

export function SendButton() {
  return (
    <Button className="rounded-full" variant={"outline"}>
      <Send />
    </Button>
  );
}
