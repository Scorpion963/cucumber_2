"use server";

import { ReasonPhrases } from "http-status-codes";
import { auth } from "@/lib/auth";
import { BUCKET_NAME, s3 } from "@/services/s3/s3";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { headers } from "next/headers";
import { v4 } from "uuid";
import { createPresignedPost, PresignedPost } from "@aws-sdk/s3-presigned-post";
import { BUCKET_TYPE } from "@/services/s3/lib/helpers";
import { ResponseType } from "@/types/response-types";

const ALLOWED_CONTENT_TYPES = ["image/png", "image/jpeg"];

export async function getPresignedPostUrl(
  contentType: string,
  bucketName: BUCKET_TYPE,
): Promise<ResponseType<{ key: string; url: PresignedPost }>> {
  const user = await auth.api.getSession({ headers: await headers() });
  if (!user) {
    return {
      success: false,
      error: {
        code: ReasonPhrases.UNAUTHORIZED,
        message: "You must be logged in to change the image",
      },
    };
  }

  if (!ALLOWED_CONTENT_TYPES.includes(contentType))
    return {
      success: false,
      error: {
        code: ReasonPhrases.UNPROCESSABLE_ENTITY,
        message: "Invalid data",
      },
    };

  const extension = contentType.split("/")[1];
  const key = `${v4()}.${extension}`;

  const url = await createPresignedPost(s3, {
    Bucket: bucketName,
    Key: key,
    Expires: 120,
    Conditions: [
      ["content-length-range", 0, 5000000],
      ["starts-with", "$Content-Type", "image/"],
      ["eq", "$key", key],
    ],
    Fields: { key, "Content-Type": contentType },
  });
  console.log("Presigned Post Url: ", url);

  return { data: { key, url: url }, success: true };
}

export async function getSignedPutUrl(
  contentType: string,
): Promise<ResponseType<{ key: string; url: string }>> {
  const user = await auth.api.getSession({ headers: await headers() });
  if (!user) {
    return {
      success: false,
      error: {
        code: ReasonPhrases.UNAUTHORIZED,
        message: "You must be logged in to change the image",
      },
    };
  }

  if (!ALLOWED_CONTENT_TYPES.includes(contentType))
    return {
      success: false,
      error: {
        code: ReasonPhrases.UNPROCESSABLE_ENTITY,
        message: "Invalid data",
      },
    };

  const extension = contentType.split("/")[1];
  const key = `${v4()}.${extension}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 120 });

  return { success: true, data: { key, url } };
}

// TODO: the presigned links should also be generated on the client in case the person hasn't reloaded the page
export async function getImageUrlS3(key: string) {
  const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: key });
  const url = await getSignedUrl(s3, command, { expiresIn: 120 });
  return url;
}
