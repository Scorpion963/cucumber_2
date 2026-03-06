import getUserWithContactDB from "@/features/chat/server/db/getUserWithContactDB";
import mergeContactInfoWithUser from "@/features/chat/transformers/mergeContactInfoWithUser";
import { auth } from "@/lib/auth";
import { ResponseType } from "@/types/response-types";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

// TODO: Add @ query based on if user is looking for usernames

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session === null) return apiError({code: ReasonPhrases.UNAUTHORIZED, message: "You must be logged in to search for users", status: StatusCodes.UNAUTHORIZED})

  const params = request.nextUrl.searchParams;
  const { data, success } = z.string().safeParse(params.get("query"));

  if (!success) return apiError({code: ReasonPhrases.BAD_REQUEST, message: "Invalid data", status: StatusCodes.BAD_REQUEST})
  const users = await getUserWithContactDB(data, session.user.id);

  const refinedUsers = users.map(mergeContactInfoWithUser);

  return apiSuccess(refinedUsers, 200)
}

function apiError({code, message, status}:{code: ReasonPhrases, message: string, status:StatusCodes}){
  return NextResponse.json<ResponseType<never>>({success: false, error: {code, message}}, {status: status})
}

function apiSuccess<T>(data: T, status: StatusCodes){
  return NextResponse.json<ResponseType<T>>({success: true, data: data}, {status: status})
}
