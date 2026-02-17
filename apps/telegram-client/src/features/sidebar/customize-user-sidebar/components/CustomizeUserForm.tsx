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
import { useForm, useWatch } from "react-hook-form";
import z from "zod";
import { customizeUserFormSchema } from "../schemas/customizeUserSchema";
import { authClient } from "@/lib/auth-client";
import FloatingInput from "../../../../components/FloatingInput";
import FormSection from "../../../../components/FormSection";
import DarkLineBreak from "../../../../components/DarkLineBreak";
import { handleFieldErrors } from "@/lib/errors/handleFieldErrors";
import { Modal } from "@/components/Modal";
import { ModalWithCropper } from "@/components/ModalWithCropper/ModalWithCropper";
import { getPresignedPostUrl, getSignedPutUrl } from "@/actions/getSignedUrl";
import { IMAGE_PROVIDERS, ImageProviderTypes, user } from "db";
import { ReasonPhrases } from "http-status-codes";
import { Check } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
// TODO: Display username taken error

// TODO: instead of manually passing down the image and the image provider, create a resolver that's going to return a signedUrl in case an image is from aws
// or return the image

// TODO IMPORTANT: add a zustand store and provider to update the user's state when it's changed, because now even if i change the state
// in the edit form, it doesn't actually update it clientside, as soon as i switch sidebars it goes back to the old data because the url
// doesn't change and therefore no data fetching

export default function CustomizeUserForm({
  defaultUserImage,
  defaultFields,
}: {
  defaultFields: z.infer<typeof customizeUserFormSchema>;
  defaultUserImage: {
    imageProvider: ImageProviderTypes | null;
    image: string | null;
  };
}) {
  const form = useForm<z.infer<typeof customizeUserFormSchema>>({
    resolver: zodResolver(customizeUserFormSchema),
    defaultValues: {
      bio: defaultFields.bio,
      firstName: defaultFields.firstName,
      lastName: defaultFields.lastName,
      username: defaultFields.username,
      image: null,
    },
  });

  async function handleImageUploadPost(imageToUpload: File) {
    const url = await getPresignedPostUrl(imageToUpload.type);
    if (url.error) {
      handleResponseErrors(url.error.code);
    }

    const formData = new FormData();
    Object.entries(url.data!.url.fields).forEach(([f, v]) => {
      formData.append(f, v);
    });
    formData.append("file", imageToUpload);

    console.log("URL: ", url);

    let response;
    try {
       response = await fetch(url.data!.url.url, {
        method: "POST",
        body: formData,
      });
    } catch (err) {
     console.log("ERROR: ", err)
    }

    if (!response?.ok) {
      console.log("an error inside handleIMageUploadPost response: ", response);
      form.setError("root", {
        message:
          "An error happened on our end during the image uploading, please try again later",
      });
    }

    return url.data?.key;
  }

  function handleResponseErrors(errorCode: string) {
    switch (errorCode) {
      case ReasonPhrases.UNAUTHORIZED:
        form.setError("root", {
          message: "You must be logged in to change your information",
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

  async function onSubmit(data: z.infer<typeof customizeUserFormSchema>) {
    console.log("ONSUBMIT");
    let uploadedImageKey;
    const baseUpdateUser = {
      bio: data.bio.trim().length === 0 ? null : data.bio,
      lastName: data.lastName.trim().length === 0 ? null : data.lastName,
      name: data.firstName,
      username: data.username,
    };

    if (data.image) {
      console.log("UPLOADING THE IMAGE :", uploadedImageKey);
      uploadedImageKey = await handleImageUploadPost(data.image);
    }

    const result = await authClient.updateUser({
      ...baseUpdateUser,
      ...(uploadedImageKey && {
        image: uploadedImageKey,
        imageProvider: "aws",
      }),
    });

    if (result.error?.message && result.error.code) {
      handleFieldErrors(
        { code: result.error.code, message: result.error.message },
        form,
      );
    }

    if (result.data) {
      form.reset(
        {
          bio: data.bio,
          firstName: data.firstName,
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
                      <Modal defaultOpen={false}>
                        <ModalWithCropper
                          defaultImage={defaultUserImage.image}
                          setImageInForm={field.onChange}
                        />
                      </Modal>
                    </FormControl>
                    <p></p>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />
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
            {form.formState.isSubmitting ? (
              <ImSpinner8 className="animate-spin" />
            ) : (
              <>Save</>
            )}
          </Button>
        </FormSection>
      </form>
    </Form>
  );
}
