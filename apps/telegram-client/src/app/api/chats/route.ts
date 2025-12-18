import { auth } from "@/lib/auth";
import { db, user } from "db";
import { ilike } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

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

  const users = await findUserDB(data);
  return NextResponse.json({ data: users }, { status: 200 });
}

async function findUserDB(username: string) {
  return db.query.user.findMany({ where: ilike(user.name, `%${username}%`) });
}
