import { ImageProviderTypes } from "db";
import { BUCKET_NAME, PUBLIC_BUCKET_NAME } from "../s3";

export const PUBLIC_BUCKET_URL =
  "https://cucumber-app-public.s3.us-east-2.amazonaws.com/";

export type BUCKET_TYPE = typeof BUCKET_NAME | typeof PUBLIC_BUCKET_NAME

export function getPublicAssetUrl(
  image: string | null,
  imageProvider: ImageProviderTypes | null,
) {
  return imageProvider === "aws" && image != null
    ? getS3PublicUrlFromKey(image)
    : image;
}

export function getS3PublicUrlFromKey(key: string) {
  const link = `${PUBLIC_BUCKET_URL}${key}`;
  return link;
}
