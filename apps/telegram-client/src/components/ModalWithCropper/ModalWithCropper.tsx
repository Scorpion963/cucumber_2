import { useEffect, useState } from "react";
import { ModalContent, useModal } from "../Modal";
import AvatarChange from "./AvatarChange";
import { FixedCropperWithSlider } from "../FixedCropperWithSlider";
import { CircleStencil, ImageRestriction } from "react-advanced-cropper";

export function ModalWithCropper({
  setImageInForm,
  defaultImage
}: {
  setImageInForm: (croppedImage: File) => void;
  defaultImage: string | null
}) {
  const [image, setImage] = useState<null | string>(null);
  const [croppedImage, setCroppedImage] = useState<Blob>();
  const { setIsOpen } = useModal();

  // TODO: Safely handle fetch
  async function onCropSuccess(cropped: string) {
    setIsOpen(false);
    setImage(cropped);
    const res = await fetch(cropped);
    const b = await res.blob();
    setCroppedImage(b);
    const file = new File([b], "avatar.png", { type: b.type });
    setImageInForm(file);
  }

  useEffect(() => {
    console.log("blob: ", croppedImage);
  }, [croppedImage]);

  return (
    <>
      <AvatarChange image={image ? image : defaultImage} setImage={setImage} />
      <ModalContent>
        <FixedCropperWithSlider
          onCropSuccess={(cropped) => onCropSuccess(cropped)}
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
