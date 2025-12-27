"use client";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { customizeUserFormSchema } from "../../schemas/customizeUserSchema";
import { authClient } from "@/lib/auth-client";
import FloatingInput from "./FloatingInput";
import FormSection from "./FormSection";
import DarkLineBreak from "./DarkLineBreak";
import { handleFieldErrors } from "@/features/auth/utils/handleFieldErrors";

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

    console.log("result: ", result)

    if (result.error?.message && result.error.code) {
      handleFieldErrors(
        { code: result.error.code, message: result.error.message },
        form
      );
    }

    console.log(form.getFieldState("username"));

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
              render={({ field, fieldState }) => (
                <>
                  <FloatingInput
                    labelContent="First name (required)"
                    fieldState={fieldState}
                    {...field}
                  />
                </>
              )}
            />
            <FormField
              name="lastName"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <FloatingInput
                    labelContent="Last name (optional)"
                    {...field}
                    fieldState={fieldState}
                  />
                </>
              )}
            />
            <FormField
              name="bio"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <FloatingInput labelContent="Bio" {...field} fieldState={fieldState} />
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
              render={({ field, fieldState }) => (
                <>
                  <FloatingInput labelContent="Username" {...field} fieldState={fieldState} />
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
