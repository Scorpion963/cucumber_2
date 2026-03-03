"use client";
import DarkLineBreak from "@/components/DarkLineBreak";
import FloatingInput from "@/components/FloatingInput";
import FormSection from "@/components/FormSection";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Delete, ImagePlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { upsertContact } from "../../actions/editContact";
import { useHomeChatsStore } from "@/providers/user-store-provider";
import { UserWithContactType } from "@/providers/types/user-store-provider-types";
import { Modal } from "@/components/Modal";
import { ModalWithCropper } from "@/components/ModalWithCropper/ModalWithCropper";
import z from "zod";
import useChatInfo from "../../hooks/useChatInfo";
import { uploadImageToS3 } from "@/actions/consumers/uploadToS3";
import handleUploadS3ResponseErrors from "@/lib/forms/handleUploadS3ResponseErrors";
import SaveButton from "@/components/buttons/SaveButton";

//TODO: User can't udpate the contact if the lastname or notes are empty

const editFormSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string(),
  notes: z.string(),
  image: z.file().mime(["image/jpeg", "image/png"]).nullable(),
});

type EditFormSchemaType = z.infer<typeof editFormSchema>;

//TODO: handle errors

export default function EditContactForm({
  chatter,
}: {
  chatter: UserWithContactType;
}) {
  const { updateContactInfoById } = useHomeChatsStore((state) => state);
  const { chatImageUrl } = useChatInfo();
  const defaultObject: EditFormSchemaType = chatter.contactInfo?.name
    ? {
        firstName: chatter.contactInfo.name,
        lastName: chatter.contactInfo.lastName ?? "",
        notes: chatter.contactInfo.notes ?? "",
        image: null,
      }
    : {
        firstName: chatter.name,
        lastName: chatter.lastName ?? "",
        notes: "",
        image: null,
      };

  const form = useForm<EditFormSchemaType>({
    resolver: zodResolver(editFormSchema),
    defaultValues: defaultObject,
  });

  async function handleSubmit(data: z.infer<typeof editFormSchema>) {
    let imageResponse;
    if (data.image) {
      imageResponse = await uploadImageToS3(
        data.image,
        "chatting-app-test-bucket",
      );
      // TODO: Handle errors
      if (!imageResponse.success) {
        console.log("Error inside of editContactForm happened");
        handleUploadS3ResponseErrors(imageResponse.error.code, form);
        return;
      }
    }

    const response = await upsertContact({
      contactId: chatter.id,
      firstName: data.firstName,
      lastName: data.lastName,
      notes: data.notes,
      image: imageResponse?.success && imageResponse.data.imageKey,
    });

    if (response.error || !response.data) {
      console.log("Error inside EditContactForm happened");
      console.log(response.error);
      form.setError("root", { message: response.error });
      return;
    }

    console.log("I AM HERE");

    updateContactInfoById(chatter.id, {
      imageUrl: response.data.imageUrl,
      lastName: response.data.lastName,
      name: response.data.name,
      notes: response.data.notes,
    });

    form.reset({
      firstName: response.data?.name ?? "",
      lastName: response.data?.lastName ?? "",
      notes: response.data?.notes ?? "",
      image: null,
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
          <PhotoManager
            text={`Suggest photo for ${chatter.contactInfo?.name ?? chatter.name}`}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <Modal
                    onSuccess={() => {
                      form.handleSubmit(handleSubmit)();
                    }}
                    onAbort={() => form.setValue("image", null)}
                    defaultOpen={false}
                  >
                    <ModalWithCropper
                      defaultImage={null}
                      setImageInForm={field.onChange}
                    >
                      <PhotoManager
                        text={`Set Photo for ${chatter.contactInfo?.name ?? chatter.name}`}
                      />
                    </ModalWithCropper>
                  </Modal>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <p className="text-destructive">
            {form.formState.errors.root && form.formState.errors.root.message}
          </p>

          <SaveButton
            isSubmitting={form.formState.isSubmitting}
            isSuccess={form.formState.isSubmitSuccessful}
            disabed={!form.formState.isDirty || form.formState.isSubmitting}
          />
        </FormSection>
      </form>
    </Form>
  );
}

function PhotoManager({ text }: { text: string }) {
  return (
    <Button
      asChild
      type="button"
      variant={"ghost"}
      className="flex gap-4 p-5 items-center w-full justify-start cursor-pointer"
    >
      <div>
        <ImagePlus />
        <div>{text}</div>
      </div>
    </Button>
  );
}

// TODO: Create small wrappers like the FormSection one but for other things, idk I need to find them
// TODO: Restructure the Sidebar folder, move all sidebars inside their own subfeature folders
