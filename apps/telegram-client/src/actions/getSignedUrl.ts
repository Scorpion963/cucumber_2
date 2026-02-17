"use server";

import { ReasonPhrases } from "http-status-codes";
import { auth } from "@/lib/auth";
import { BUCKET_NAME, s3 } from "@/services/s3/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { headers } from "next/headers";
import { v4 } from "uuid";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

type ErrorType = {
  code: string;
  message: string;
};

type DataType = {
  url: string;
  key: string;
};

type SignedUrlSuccessType = {
  data: DataType;
  error: null;
};

type SignedUrlFailType = {
  data: null;
  error: ErrorType;
};

type SignedUrlResponseType = SignedUrlSuccessType | SignedUrlFailType;

const ALLOWED_CONTENT_TYPES = ["image/png", "image/jpeg"];

export async function getPresignedPostUrl(contentType: string) {
  const user = await auth.api.getSession({ headers: await headers() });
  if (!user) {
    return {
      error: {
        code: ReasonPhrases.UNAUTHORIZED,
        message: "You must be logged in to change the image",
      },
      data: null,
    };
  }

  if (!ALLOWED_CONTENT_TYPES.includes(contentType))
    return {
      error: {
        code: ReasonPhrases.UNPROCESSABLE_ENTITY,
        message: "Invalid data",
      },
      data: null,
    };

  const extension = contentType.split("/")[1];
  const key = `${v4()}.${extension}`;

  const url = await createPresignedPost(s3, {
    Bucket: BUCKET_NAME,
    Key: key,
    Expires: 120,
    Conditions: [
      ["content-length-range", 0, 5000000],
      ["starts-with", "$Content-Type", "image/"],
      ["eq", "$key", key],
    ],
    Fields: { key, "Content-Type": contentType },
  });
  console.log("Presigned Post Url: ", url)

  return { error: null, data: { key, url: url } };
}

export async function getSignedPutUrl(
  contentType: string,
): Promise<SignedUrlResponseType> {
  const user = await auth.api.getSession({ headers: await headers() });
  if (!user) {
    return {
      error: {
        code: ReasonPhrases.UNAUTHORIZED,
        message: "You must be logged in to change the image",
      },
      data: null,
    };
  }

  if (!ALLOWED_CONTENT_TYPES.includes(contentType))
    return {
      error: {
        code: ReasonPhrases.UNPROCESSABLE_ENTITY,
        message: "Invalid data",
      },
      data: null,
    };

  const extension = contentType.split("/")[1];
  const key = `${v4()}.${extension}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 120 });

  return { error: null, data: { key, url } };
}
