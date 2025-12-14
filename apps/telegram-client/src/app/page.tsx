import { authClient } from "@/lib/auth-client";
import { db } from "db";
import { io } from "socket.io-client";

const email = "jackson2006208@gmail.com";
const password = "123123123123";
const name = "scorpion";

export default async function Home() {
  const { data, error } = await authClient.signUp.email(
    {
      email, // user email address
      password, // user password -> min 8 characters by default
      name, // user display name
      callbackURL: "/", // A URL to redirect to after the user verifies their email (optional)
    },
    {
      onRequest: (ctx) => {
        console.log(ctx);
      },
      onSuccess: (ctx) => {
        console.log(ctx);
      },
      onError: (ctx) => {
        console.log();
        // display thctxe error message
        alert(ctx.error.message);
      },
    }
  );
  return <div></div>;
}
