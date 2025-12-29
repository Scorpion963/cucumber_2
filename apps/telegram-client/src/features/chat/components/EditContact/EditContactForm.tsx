"use client";
import DarkLineBreak from "@/components/DarkLineBreak";
import FloatingInput from "@/components/FloatingInput";
import FormSection from "@/components/FormSection";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Delete, ImagePlus } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
import { useChatStore } from "../../providers/chatStoreProvider";
import { upsertContact } from "../../actions/editContact";

const editFormSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string(),
  notes: z.string(),
});

//TODO: handle errors

export default function EditContactForm() {
  const { contact, updateContactFields } = useChatStore((state) => state);
  const form = useForm<z.infer<typeof editFormSchema>>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      firstName: contact?.name ?? "",
      lastName: contact?.lastName ?? "",
      notes: contact?.notes ?? "",
    },
  });

  async function handleSubmit(data: z.infer<typeof editFormSchema>) {
    const response = await upsertContact({
      contactId: contact?.id ?? "",
      firstName: data.firstName,
      lastName: data.lastName,
      notes: data.notes,
    });

    if (response.error || !response.data) {
      console.log("Error inside EditContactForm happened");
      console.log(response.error);
      return;
    }

    updateContactFields({
      name: response.data.name,
      imageUrl: response.data.imageUrl,
      lastName: response.data.lastName,
      notes: response.data.notes,
    });

    form.reset({
      firstName: response.data?.name ?? "",
      lastName: response.data?.lastName ?? "",
      notes: response.data?.notes ?? "",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => handleSubmit(data))}>
        <FormSection>
          <FormField
            name="firstName"
            control={form.control}
            render={({ field, fieldState }) => (
              <FloatingInput
                {...field}
                fieldState={fieldState}
                labelContent="First Name"
              />
            )}
          />
          <FormField
            name="lastName"
            control={form.control}
            render={({ field, fieldState }) => (
              <FloatingInput
                {...field}
                fieldState={fieldState}
                labelContent="Last Name"
              />
            )}
          />
          <FormField
            name="notes"
            control={form.control}
            render={({ field, fieldState }) => (
              <FloatingInput
                {...field}
                fieldState={fieldState}
                labelContent="Notes"
              />
            )}
          />
        </FormSection>
        <DarkLineBreak />
        <FormSection>
          <PhotoManager text="Suggest Photo for Egor" />
          <PhotoManager text="Set Photo for Egor" />
          <p className="text-muted-foreground">
            You can replace Egor\`s photo with another photo that only you will
            see
          </p>
        </FormSection>
        <DarkLineBreak />

        <FormSection>
          <Button
            variant={"ghost"}
            className="w-full items-center justify-start hover:text-destructive text-destructive cursor-pointer p-5  text-md gap-4"
            type="button"
          >
            <Delete />
            <div>Delete Contact</div>
          </Button>
        </FormSection>

        <DarkLineBreak />
        <FormSection>
          <Button className="w-full cursor-pointer">Save</Button>
        </FormSection>
      </form>
    </Form>
  );
}

function PhotoManager({ text }: { text: string }) {
  return (
    <Button
      variant={"ghost"}
      className="flex gap-4 p-5 items-center w-full justify-start cursor-pointer"
    >
      <ImagePlus />
      <div>{text}</div>
    </Button>
  );
}

// TODO: Create small wrappers like the FormSection one but for other things, idk I need to find them
// TODO: Restructure the Sidebar folder, move all sidebars inside their own subfeature folders
