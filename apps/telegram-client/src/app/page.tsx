import Chat from "@/features/chat/Chat";
import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";

export default async function Home() {
  return (
    <div className="w-full h-screen">
     <Chat />
    </div>
  );
}
