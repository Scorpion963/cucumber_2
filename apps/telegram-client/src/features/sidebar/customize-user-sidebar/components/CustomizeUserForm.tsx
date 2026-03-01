"use client";
import { motion } from "framer-motion";
import { ImSpinner8 } from "react-icons/im";
import { Button } from "@/components/ui/button";
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
import { ReasonPhrases } from "http-status-codes";
import { Check } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useCurrentUserStore } from "@/providers/current-user-store-provider";
import { ReactNode } from "react";
import z from "zod";
import { uploadImageToS3 } from "@/actions/consumers/uploadToS3";

// TODO: Display username taken error

function handleResponseErrors<T extends FieldValues>(
  errorCode: string,
  form: UseFormReturn<T>,
) {
  switch (errorCode) {
    case ReasonPhrases.UNAUTHORIZED:
      form.setError("root", {
        message: "You must be logged in to update this information",
      });
      return;
    case ReasonPhrases.UNPROCESSABLE_ENTITY:
      form.setError("root", { message: "Invalid content type" });
      return;
    default:
      form.setError("root", {
        message: "Unexpected error happened, please try again later",
      });
  }
}

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
        handleResponseErrors(uploadedImageKey.error.code, form);
      } else {
        updateUser({
          imageProvider: "aws",
          image: uploadedImageKey.data.imageKey,
        });
      }
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
              https://t.me/dimasik23123
            </p>
          </FormSection>
        </div>

        <FormSection>
          <div className="h-6">
            <AnimatePresence>
              {form.formState.isSubmitSuccessful &&
                !form.formState.isSubmitting && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-2 text-green-400"
                  >
                    <Check />
                    <span>Success</span>
                  </motion.div>
                )}
            </AnimatePresence>
          </div>

          {form.formState.errors.root && (
            <p className="text-destructive">
              {form.formState.errors.root.message}
            </p>
          )}

          <Button
            disabled={!form.formState.isDirty || form.formState.isSubmitting}
            className="w-full cursor-pointer"
          >
            <ConditionalLoading isLoading={form.formState.isSubmitting}>
              <>Save</>
            </ConditionalLoading>
          </Button>
        </FormSection>
      </form>
    </Form>
  );
}

function ConditionalLoading({
  isLoading,
  children,
}: {
  isLoading: boolean;
  children: ReactNode;
}) {
  return isLoading ? <ImSpinner8 className="animate-spin" /> : children;
}
