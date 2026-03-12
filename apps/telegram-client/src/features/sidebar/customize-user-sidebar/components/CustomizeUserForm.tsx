"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm, UseFormReturn } from "react-hook-form";
import { customizeUserFormSchema } from "../schemas/customizeUserSchema";
import { authClient } from "@/lib/auth-client";
import FloatingInput from "../../../../components/FloatingInput";
import FormSection from "../../../../components/FormSection";
import DarkLineBreak from "../../../../components/DarkLineBreak";
import { handleFieldErrors } from "@/lib/errors/handleFieldErrors";
import { Modal } from "@/components/Modal";
import { ModalWithCropper } from "@/components/ModalWithCropper/ModalWithCropper";
import { ImageProviderTypes } from "db";
import { useCurrentUserStore } from "@/providers/current-user-store-provider";
import z from "zod";
import { uploadImageToS3 } from "@/actions/consumers/uploadToS3";
import handleUploadS3ResponseErrors from "@/lib/forms/handleUploadS3ResponseErrors";
import SaveButton from "@/components/buttons/SaveButton";

// TODO: Display username taken error

export default function CustomizeUserForm({
  defaultUserImage,
  defaultFields,
}: {
  defaultFields: Omit<z.infer<typeof customizeUserFormSchema>, "image">;
  defaultUserImage: {
    imageProvider: ImageProviderTypes | null;
    image: string | null;
  };
}) {
  const { updateUser } = useCurrentUserStore((state) => state);
  const form = useForm<z.infer<typeof customizeUserFormSchema>>({
    resolver: zodResolver(customizeUserFormSchema),
    defaultValues: {
      bio: defaultFields.bio,
      name: defaultFields.name,
      lastName: defaultFields.lastName,
      username: defaultFields.username,
      image: null,
    },
  });

  async function onSubmit(data: z.infer<typeof customizeUserFormSchema>) {
    let uploadedImageKey;
    const baseUpdateUser = {
      bio: data.bio.trim().length === 0 ? null : data.bio,
      lastName: data.lastName.trim().length === 0 ? null : data.lastName,
      name: data.name,
      username: data.username,
    };

    if (data.image) {
      uploadedImageKey = await uploadImageToS3(
        data.image,
        "cucumber-app-public",
      );
      if (!uploadedImageKey.success) {
        handleUploadS3ResponseErrors(uploadedImageKey.error.code, form);
        return
      }
      //  else {
      //   updateUser({
      //     imageProvider: "aws",
      //     image: uploadedImageKey.data.imageKey,
      //   });
      // }
    }

    const result = await authClient.updateUser({
      ...baseUpdateUser,
      ...(uploadedImageKey?.success && {
        image: uploadedImageKey.data.imageKey,
        imageProvider: "aws",
      }),
    });

    if (result.error?.message && result.error.code) {
      handleFieldErrors(
        { code: result.error.code, message: result.error.message },
        form,
      );
      return;
    }

    updateUser({
      ...data,
      imageProvider: undefined,
      image: undefined,
    });

    if (result.data) {
      form.reset(
        {
          bio: data.bio,
          name: data.name,
          lastName: data.lastName,
          username: data.username,
          image: null
        },
        { keepErrors: true },
      );
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
            <FormField
              name="image"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <FormItem>
                    <FormControl>
                      <Modal
                        onAbort={() => form.setValue("image", null)}
                        defaultOpen={false}
                      >
                        <ModalWithCropper
                          defaultImage={defaultUserImage.image}
                          setImageInForm={field.onChange}
                        />
                      </Modal>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />
          </div>
          <FormSection>
            <FormField
              name="name"
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
                  <FloatingInput
                    labelContent="Bio"
                    {...field}
                    fieldState={fieldState}
                  />
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
                  <FloatingInput
                    labelContent="Username"
                    {...field}
                    fieldState={fieldState}
                  />
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
              https://t.me/{defaultFields.username}
            </p>
          </FormSection>
        </div>

        <FormSection>
          {form.formState.errors.root && (
            <p className="text-destructive">
              {form.formState.errors.root.message}
            </p>
          )}

          <SaveButton disabed={!form.formState.isDirty || form.formState.isSubmitting} isSubmitting={form.formState.isSubmitting} isSuccess={form.formState.isSubmitSuccessful} />
        </FormSection>
      </form>
    </Form>
  );
}

