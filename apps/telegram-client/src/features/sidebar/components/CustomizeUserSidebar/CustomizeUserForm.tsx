import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Edit } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";

const customizeUserFormSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  bio: z.string().trim().min(1),
  username: z.string().trim(),
});

export default function CustomizeUserForm({
  defaultFields,
}: {
  defaultFields: z.infer<typeof customizeUserFormSchema>;
}) {
  const form = useForm<z.infer<typeof customizeUserFormSchema>>({
    resolver: zodResolver(customizeUserFormSchema),
    defaultValues: {
      bio: defaultFields.bio,
      firstName: defaultFields.firstName,
      lastName: defaultFields.lastName,
      username: defaultFields.firstName,
    },
  });
  const formChanged = useWatch({
    compute: (data: z.infer<typeof customizeUserFormSchema>) => {
      return JSON.stringify(data) !== JSON.stringify(defaultFields);
    },
    control: form.control,
  });

  function onSubmit() {}

  return (
    <Form {...form}>
      <form
        className="relative h-full flex flex-col justify-between"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div>
          <div className="w-full flex items-center justify-center">
            <div className="size-32 rounded-full bg-gray-500 flex items-center justify-center">
              <Edit className="size-16" />
            </div>
          </div>
          <div className="p-6 space-y-4">
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
          </div>

          <DarkLineBreak />

          <div className="p-6  text-sm flex flex-col gap-4">
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
          </div>
        </div>
        <Button className="m-6">Save</Button>
      </form>
    </Form>
  );
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
