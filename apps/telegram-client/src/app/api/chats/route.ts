import getUserWithContactDB from "@/features/chat/server/db/getUserWithContactDB";
import mergeContactInfoWithUser from "@/features/chat/transformers/mergeContactInfoWithUser";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

// TODO: Add @ query based on if user is looking for usernames

// TODO: use the users from here in chats (like when i merge customized contact info), when someone opens a chat
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

  const users = await getUserWithContactDB(data, session.user.id);

  const refinedUsers = users.map(mergeContactInfoWithUser);

  console.log("refinedUsers: ", refinedUsers);

  return NextResponse.json({ data: refinedUsers }, { status: 200 });
}

