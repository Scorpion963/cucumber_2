"use client";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import DarkLineBreak from "@/features/sidebar/components/CustomizeUserSidebar/DarkLineBreak";
import FloatingInput from "@/features/sidebar/components/CustomizeUserSidebar/FloatingInput";
import FormSection from "@/features/sidebar/components/CustomizeUserSidebar/FormSection";
import { zodResolver } from "@hookform/resolvers/zod";
import { Delete, ImagePlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { FaPhotoVideo } from "react-icons/fa";
import z from "zod";

const editFormSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  notes: z.string().trim(),
});

export default function EditContactForm() {
  const form = useForm<z.infer<typeof editFormSchema>>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      notes: "",
    },
  });

  function handleSubmit() {}

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
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
            className="w-full items-center justify-start hover:text-destructive text-destructive cursor-pointer p-6 text-md gap-4"
          >
            <div className="flex gap-4  items-center">
              <Delete />
              <div>Delete Contact</div>
            </div>
          </Button>
        </FormSection>
      </form>
    </Form>
  );
}

function PhotoManager({ text }: { text: string }) {
  return (
    <div className="flex gap-4 items-center">
      <ImagePlus />
      <div>{text}</div>
    </div>
  );
}
