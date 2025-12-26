"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { customizeUserFormSchema } from "../../schemas/customizeUserSchema";
import { authClient } from "@/lib/auth-client";

// TODO: Display username taken error

export default function CustomizeUserForm({
  defaultFields,
}: {
  defaultFields: z.infer<typeof customizeUserFormSchema>;
}) {
  const [defaultFieldState, setDefaultFieldState] = useState(defaultFields);
  const form = useForm<z.infer<typeof customizeUserFormSchema>>({
    resolver: zodResolver(customizeUserFormSchema),
    defaultValues: {
      bio: defaultFieldState.bio,
      firstName: defaultFieldState.firstName,
      lastName: defaultFieldState.lastName,
      username: defaultFieldState.username,
    },
  });

  async function onSubmit(data: z.infer<typeof customizeUserFormSchema>) {
    const result = await authClient.updateUser({
      bio: data.bio.trim().length === 0 ? null : data.bio,
      lastName: data.lastName.trim().length === 0 ? null : data.lastName,
      name: data.firstName,
      username: data.username,
    });

    if (result.data) {
      form.reset({
        bio: data.bio,
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
      });
      setDefaultFieldState(data);
    }
  }

  return (
    <Form {...form}>
      <form
        className="relative h-full flex flex-col justify-between"
        onSubmit={form.handleSubmit((data) => onSubmit(data))}
      >
        <div>
          <div className="w-full flex items-center justify-center">
            <div className="size-32 rounded-full bg-gray-500 flex items-center justify-center">
              <Edit className="size-16" />
            </div>
          </div>
          <FormSection>
            {" "}
            <FormField
              name="firstName"
              control={form.control}
              render={({ field }) => (
                <>
                  <FloatingInput
                    labelContent="First name (required)"
                    {...field}
                  />
                </>
              )}
            />
            <FormField
              name="lastName"
              control={form.control}
              render={({ field }) => (
                <>
                  <FloatingInput
                    labelContent="Last name (optional)"
                    {...field}
                  />
                </>
              )}
            />
            <FormField
              name="bio"
              control={form.control}
              render={({ field }) => (
                <>
                  <FloatingInput labelContent="Bio" {...field} />
                </>
              )}
            />
            <div className="text-muted-foreground text-sm">
              <div>Any details such as age, occupation or city.</div>
              <div>Example 23 y.o. desginer from San Francisco</div>
            </div>
          </FormSection>

          <DarkLineBreak />

          <FormSection className="text-sm">
            {" "}
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <>
                  <FloatingInput labelContent="Username" {...field} />
                </>
              )}
            />
            <p className="text-muted-foreground">
              You can choose a username on cucumber. If you do, people will be
              able to find you by this username.
            </p>
            <p className="text-muted-foreground">
              You can use a-z, 0-9 and underscores. Minimum length is 5
              characters. <br /> This link opens a chat with you: <br />
              https://t.me/dimasik23123
            </p>
          </FormSection>
        </div>

        <FormSection>
          <Button disabled={!form.formState.isDirty} className="w-full">
            Save
          </Button>
        </FormSection>
      </form>
    </Form>
  );
}

function FormSection({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("p-6 space-y-4", className)}>{children}</div>;
}

function FloatingInput({
  labelContent,
  ...props
}: React.ComponentProps<"input"> & { labelContent: string }) {
  return (
    <FormItem className="relative">
      <FormControl>
        <Input
          placeholder="First Name"
          className="peer dark:bg-background focus:bg-background placeholder:text-transparent p-5 rounded-lg dark:text-[1rem]"
          {...props}
        />
      </FormControl>
      <FormLabel className="peer-focus:bottom-9 text-[1rem] bottom-2 transition-all bg-background px-1 peer-focus:text-xs absolute left-4 peer-not-placeholder-shown:bottom-9 peer-not-placeholder-shown:text-xs text-muted-foreground">
        {labelContent}
      </FormLabel>
    </FormItem>
  );
}

function DarkLineBreak() {
  return <div className="w-full h-2 bg-primary-foreground rounded-r-sm"></div>;
}

// <FormItem className="relative">
//                   <FormControl>
//                     <Input placeholder="hello" className="peer placeholder:text-transparent dark:bg-background focus:bg-background" {...field} />
//                   </FormControl>
//                   <FormLabel className="peer-focus:bottom-8 bottom-3 transition-all bg-background px-1 peer-focus:text-xs absolute left-3 peer-not-placeholder-shown:bottom-8 peer-not-placeholder-shown:text-xs">
//                     Username
//                   </FormLabel>
//                 </FormItem>

// one of the versions:

//  <FormField
//             name="lastName"
//             control={form.control}
//             render={({ field }) => (
//               <>

//               </>
//             )}
//           />
