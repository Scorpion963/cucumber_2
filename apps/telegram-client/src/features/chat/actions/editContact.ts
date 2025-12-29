"use server";

import { auth } from "@/lib/auth";
import { contact, db, user } from "db";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import z from "zod";

const editContactSchemaAction = z.object({
  firstName: z.string().trim().min(5),
  lastName: z
    .string()
    .trim()
    .nullable()
    .transform((val) =>
      typeof val === "string" && val.trim().length !== 0 ? val : null
    ),
  notes: z
    .string()
    .trim()
    .nullable()
    .transform((val) =>
      typeof val === "string" && val.trim().length !== 0 ? val : null
    ),
  contactId: z.string().trim().min(1),
});

export async function upsertContact(
  requestData: z.infer<typeof editContactSchemaAction>
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { data: null, error: "User not logged in" };

  const { data, success } = editContactSchemaAction.safeParse(requestData);
  if (!success) return { data: null, error: "Invalid data" };

  try {
    const [updatedContact] = await db
      .insert(contact)
      .values({
        contactId: data.contactId,
        ownerId: session.user.id,
        name: data.firstName,
        lastName: data.lastName,
        notes: data.notes,
      })
      .onConflictDoUpdate({
        set: {
          name: data.firstName,
          lastName: data.lastName,
          notes: data.notes,
        },
        target: [contact.ownerId, contact.contactId],
        setWhere: eq(contact.ownerId, session.user.id),
      })
      .returning();

      console.log("Updated: ", updatedContact)

    return { data: updatedContact, error: null };
  } catch {
    return { data: null, error: "Error during inserting happened" };
  }
}
