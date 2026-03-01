import { BUCKET_TYPE } from "@/services/s3/lib/helpers";
import { getPresignedPostUrl } from "../getSignedUrl";
import { PresignedPost } from "@aws-sdk/s3-presigned-post";
import { ResponseType } from "@/types/response-types";

export function createFormDataForS3Upload(fileToUpload: File, url: PresignedPost) {
  const formData = new FormData();
  Object.entries(url.fields).forEach(([f, v]) => {
    formData.append(f, v);
  });
  formData.append("file", fileToUpload);
  return formData;
}

export async function uploadImageToS3(imageToUpload: File, bucket: BUCKET_TYPE): Promise<ResponseType<{imageKey: string}>> {
    const url = await getPresignedPostUrl(
      imageToUpload.type,
      bucket,
    );

    if (!url.success) {
      return {success: url.success, error: {code: url.error.code, message: url.error.message}}
    }

    const formData = createFormDataForS3Upload(imageToUpload, url.data!.url);

    let response;
    try {
      response = await fetch(url.data.url.url, {
        method: "POST",
        body: formData,
      });
    } catch (err) {
      console.log("ERROR: ", err);
    }

    if (!response?.ok) {
      console.log("an error inside handleImagePost response: ", response);
    }

    return {success: true, data: {imageKey: url.data.key}};
  }