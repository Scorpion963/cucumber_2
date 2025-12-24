import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { user } from "db";
import { Edit } from "lucide-react";
import { useForm } from "react-hook-form";
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

  function onSubmit() {}

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="w-full flex items-center justify-center">
          <div className="size-32 rounded-full bg-gray-500 flex items-center justify-center">
            <Edit className="size-16" />
          </div>
        </div>
        <div className="p-6">
          {" "}
          <FormField
            name="firstName"
            control={form.control}
            render={({ field }) => (
              <>
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              </>
            )}
          />
          <FormField
            name="lastName"
            control={form.control}
            render={({ field }) => (
              <>
                <FormItem>
                  <FormLabel>Last name (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              </>
            )}
          />
          <FormField
            name="bio"
            control={form.control}
            render={({ field }) => (
              <>
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
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
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input className="" {...field} />
                  </FormControl>
                </FormItem>
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
      </form>
    </Form>
  );
}

function DarkLineBreak() {
  return <div className="w-full h-2 bg-primary-foreground rounded-r-sm"></div>;
}
