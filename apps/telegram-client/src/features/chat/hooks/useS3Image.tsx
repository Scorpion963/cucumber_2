import { getImageUrlS3 } from "@/actions/getSignedUrl";
import { getPublicAssetUrl, getS3PublicUrlFromKey } from "@/services/s3/lib/helpers";
import { ImageProviderTypes } from "db";
import { useEffect, useState } from "react";

type useS3ImageProps = {
  url: string | null;
  isPublic: boolean;
  imageProvider: ImageProviderTypes
};

export default function useS3Image({ url, isPublic, imageProvider }: useS3ImageProps) {
  const [image, setImage] = useState<string | null>(null);

  console.log("URL before interfering: ", url)

  useEffect(() => {
    async function handleImageFetch() {
      if(url == null) return null

      if (isPublic && imageProvider === "aws") {
        setImage(getS3PublicUrlFromKey(url));
        return
      }

      if(imageProvider !== "aws"){
        setImage(url)
        return
      }

      try {
        const s3Url = await getImageUrlS3(url);
        setImage(s3Url);
      } catch {
        console.log("Error in useS3Image happened; error fetching image");
      }
    }
    handleImageFetch();
  }, [url, isPublic, imageProvider]);

  return image;
}
