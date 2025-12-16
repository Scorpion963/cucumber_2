"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";
import GoogleButton from "./shared/GoogleButton";
import GithubButton from "./shared/GithubButton";
import { handleFieldErrors } from "../utils/handleFieldErrors";
import { useRouter } from "next/navigation";
import { handleSocialSignIn } from "../utils/handleSocialSignIn";

const signInFormSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});


export default function SignInForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(formData: z.infer<typeof signInFormSchema>) {
    const { data, error } = await authClient.signIn.email(
      {
        email: formData.email,
        password: formData.password,
        callbackURL: "/",
      },
      { onError: (ctx) => console.log(ctx.error) }
    );
    if (error?.code && error?.message) {
      handleFieldErrors({ code: error.code, message: error.message }, form);
    } else router.replace("/");
  }

  return (
    <div className="w-[400px]">
      <Card>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} action="">
              <FieldGroup className="flex flex-col gap-8">
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold">Welcome Back</h1>
                  <p className="text-muted-foreground text-sm">
                    Login to your Cucumber account
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="m@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between">
                          <FormLabel>Password</FormLabel>
                          <Link className="text-xs" href="/">
                            Forgout Password?
                          </Link>
                        </div>

                        <FormControl>
                          <Input type="password" placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {form.formState.errors.root && (
                  <p className="text-destructive text-sm text-center">
                    {form.formState.errors.root.message}
                  </p>
                )}
                <Button className="w-full cursor-pointer">Login</Button>
                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                  Or continue with
                </FieldSeparator>
                <div className="grid grid-cols-2 gap-4">
                  <GoogleButton
                    onClick={() => handleSocialSignIn("google", form)}
                  />
                  <GithubButton
                    onClick={() => handleSocialSignIn("github", form)}
                  />
                </div>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link href={"/sign-up"}>Sign up</Link>
                </FieldDescription>
              </FieldGroup>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
