import { auth } from "@/lib/auth";
import { contact, db, user } from "db";
import { eq, ilike, or } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

// TODO: Add @ query based on if user is looking for usernames

// TODO: use the users from here in chats, when someone opens a chat
// it can be done by either caching the db query or storing the state inside a zustand store 

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  console.log(session);
  if (session === null)
    return NextResponse.json(
      { message: "You must be logged in to search users!" },
      { status: 401 }
    );

  const params = request.nextUrl.searchParams;
  const { data, success } = z.string().safeParse(params.get("query"));

  if (!success)
    return NextResponse.json({ message: "Invalid Request" }, { status: 400 });

  const users = await findUserDB(data, session.user.id);
  
  const refinedUsers = users.map(item => {
    const refinedUser: typeof user.$inferSelect = {
      ...item,
      image: item.contactsOf[0].imageUrl ? item.contactsOf[0].imageUrl : item.image,
      name: item.contactsOf[0].name ? item.contactsOf[0].name : item.name
    }

    return refinedUser
  })
  
  console.log("refinedUsers: ", refinedUsers)

  return NextResponse.json({ data: refinedUsers }, { status: 200 });
}

async function findUserDB(username: string, userId: string) {
  return db.query.user.findMany({
    where: or(
      ilike(user.username, `%${username}%`),
      ilike(user.name, `${username}`)
    ),
    with: { contactsOf: {
      where: eq(contact.ownerId, userId),
      limit: 1
    } },
  });
}
