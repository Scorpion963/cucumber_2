"use client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field";
import { FaApple, FaGithub, FaGoogle } from "react-icons/fa";

const signInFormSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export default function SignInForm() {
  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit() {}

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
                        <FormLabel>Username</FormLabel>
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
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button className="w-full">Login</Button>
                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                  Or continue with
                </FieldSeparator>
                <div className="grid grid-cols-3 gap-4">
                  <Button
                    type="button"
                    variant={"outline"}
                    className="w-auto cursor-pointer"
                  >
                    <FaApple />
                    <p className="sr-only">Sign in with Apple</p>
                  </Button>
                  <Button
                    type="button"
                    variant={"outline"}
                    className="w-auto cursor-pointer"
                  >
                    <FaGoogle />
                    <p className="sr-only">Sign in with Google</p>
                  </Button>
                  <Button
                    type="button"
                    variant={"outline"}
                    className="w-auto cursor-pointer"
                  >
                    <FaGithub />
                    <p className="sr-only">Sign in with Github</p>
                  </Button>
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
