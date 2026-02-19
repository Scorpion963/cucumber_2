import { useEffect, useState } from "react";
import { ModalContent, useModal } from "../Modal";
import AvatarChange from "./AvatarChange";
import { FixedCropperWithSlider } from "../FixedCropperWithSlider";
import { CircleStencil, ImageRestriction } from "react-advanced-cropper";
import { toast } from "sonner";

export function ModalWithCropper({
  setImageInForm,
  defaultImage,
}: {
  setImageInForm: (croppedImage: File | null) => void;
  defaultImage: string | null;
}) {
  const [image, setImage] = useState<null | string>(null);
  const { setIsOpen, isOpen } = useModal();

  function compressImage(
    image: string,
    targetSize: number = 256,
    quality: number = 0.8,
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const imgElement = new Image();
      imgElement.src = image;

      if (!context) {
        reject(new Error("Context can't be loaded, canvas not supported"));
        return;
      }

      imgElement.onload = async () => {
        if(imgElement.height <= targetSize || imgElement.width <= targetSize) {
          const response = await fetch(image)
          const blob = await response.blob()
          resolve(blob)
        }

        canvas.width = targetSize;
        canvas.height = targetSize;

        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";

        context.drawImage(imgElement, 0, 0, targetSize, targetSize);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Compression failed"));
              return;
            }
            resolve(blob);
          },
          "image/jpeg",
          quality,
        );
      };
    });
  }

  // TODO: Safely handle fetch
  async function onCropSuccess(cropped: string) {
    setIsOpen(false);
    setImage(cropped);
    URL.revokeObjectURL(cropped)
    try {
      const compressedImage = await compressImage(cropped);
      console.log("compressedImage: ", compressedImage);
      const file = new File([compressedImage], "avatar.png", { type: "image/jpeg" });
      setImageInForm(file);
    } catch (err) {
      console.log(err)
      toast.error("Image prcessing failed");
    }
  }

  async function onCropCancel(){
    setIsOpen(false)
    setImage(defaultImage)
    setImageInForm(null)
  }  

  return (
    <>
      <AvatarChange image={image ? image : defaultImage} setImage={setImage} />
      <ModalContent onAbort={onCropCancel}>
        <FixedCropperWithSlider
          onCropSuccess={(cropped) => onCropSuccess(cropped)}
          onCropCancel={onCropCancel}
          stencilSize={{ width: 400, height: 400 }}
          src={
            image
              ? image
              : "https://images.unsplash.com/photo-1762692496722-de2a899e3af5?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          className="h-96 w-96 flex flex-col gap-2 rounded-lg"
          stencilComponent={CircleStencil}
          stencilProps={{
            handlers: false,
            lines: false,
            movable: false,
            resizable: false,
          }}
          imageRestriction={ImageRestriction.fillArea}
        />
      </ModalContent>
    </>
  );
}
