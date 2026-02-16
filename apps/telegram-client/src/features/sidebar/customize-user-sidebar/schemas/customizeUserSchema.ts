import z from "zod";

export const customizeUserFormSchema = z.object({
  firstName: z.string().trim().min(1, {message: "Please provide your first name"}),
  lastName: z.string().trim(),
  bio: z.string().trim(),
  username: z.string().trim().min(5),
  image: z.file().mime(["image/png", "image/jpeg"]).nullable(),
});

export const customizeUserSchemaServer = z.object({
  ...customizeUserFormSchema.shape,
  bio: z
    .string()
    .trim()
    .nullable()
    .transform((val) =>
      typeof val === "string" && val.trim().length !== 0 ? val : null
    ),
  lastName: z
    .string()
    .trim()
    .nullable()
    .transform((val) =>
      typeof val === "string" && val.trim().length !== 0 ? val : null
    ),
});
