import z from "zod";

export const customizeUserFormSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim(),
  bio: z.string().trim(),
  username: z.string().trim(),
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
