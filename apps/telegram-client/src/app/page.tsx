import { authClient } from "@/lib/auth-client";
import { db } from "db";
import { io } from "socket.io-client";

export default async function Home() {
  const { data, error } = await authClient.signUp.email(
    {
      email: "alexkaravay3@gmail.com",
      password: "123123123123",
      name: "Egor",
      callbackURL: "/",
    },
    {
      onError: (ctx) => console.log(ctx),
      onSuccess: ctx => console.log(ctx)
    }
  );
  return <div></div>;
}
