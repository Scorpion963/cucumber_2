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
import { useRouter } from "next/navigation";
import GoogleButton from "./shared/GoogleButton";
import GithubButton from "./shared/GithubButton";
import { handleFieldErrors } from "../utils/handleFieldErrors";
import { handleSocialSignIn } from "../utils/handleSocialSignIn";

const signUpFormSchema = z
  .object({
    email: z.email(),
    name: z.string().trim().min(1),
    password: z.string().trim().min(9),
    passwordCheck: z.string().trim().min(9),
    username: z.string().trim().min(5),
  })
  .superRefine((val, ctx) => {
    if (val.password.trim() !== val.passwordCheck.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords must match!",
        path: ["password"],
      });

      ctx.addIssue({
        code: "custom",
        message: "Passwords must match!",
        path: ["passwordCheck"],
      });
    }
  });


export default function SignUpForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordCheck: "",
      name: "",
      username: "",
    },
  });

  async function onSubmit(formData: z.infer<typeof signUpFormSchema>) {
    const { data, error } = await authClient.signUp.email(
      {
        email: formData.email,
        password: formData.password,
        callbackURL: "/",
        name: formData.name,
        username: formData.username,
      },
      { onError: (ctx) => console.log(ctx.error) }
    );
    if (error?.code && error?.message) {
      console.log("status text: ")
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
                  <h1 className="text-2xl font-bold">Create your account</h1>
                  <p className="text-muted-foreground text-sm">
                    Enter your email below to create your account
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Elvis Presley" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="username"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Elvis123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                        </div>

                        <FormControl>
                          <Input type="password" placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="passwordCheck"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between">
                          <FormLabel>Confirm Password</FormLabel>
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

                <Button className="w-full cursor-pointer">Sign up</Button>

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
                  Already have an account?{" "}
                  <Link href={"/sign-in"}>Sign in</Link>
                </FieldDescription>
              </FieldGroup>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
