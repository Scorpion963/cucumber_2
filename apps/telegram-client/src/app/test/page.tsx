"use client";

import { FixedCropperWithSlider } from "@/components/FixedCropperWithSlider";
import { Modal, ModalContent, useModal } from "@/components/Modal";
import { Check, Edit } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, ReactNode, useEffect, useRef, useState } from "react";
import { CircleStencil, ImageRestriction } from "react-advanced-cropper";

export default function Page() {
  return <div>{/* <ModalWithCropper /> */}</div>;
}

export function ModalWithCropper({
  setImageInForm,
}: {
  setImageInForm: (croppedImage: File) => void;
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
    setImageInForm(file)
  }

  useEffect(() => {
    console.log("blob: ", croppedImage);
  }, [croppedImage]);

  return (
    <>
      <AvatarChange image={image} setImage={setImage} />
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

function FixedSliderCropperModal() {
  return (
    <Modal defaultOpen={false}>
      <ModalWithCropper />
    </Modal>
  );
}

function AvatarChange({
  setImage,
  image,
}: {
  setImage: React.Dispatch<React.SetStateAction<string | null>>;
  image: string | null;
}) {
  const { setIsOpen, isOpen } = useModal();

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();

    const file = e.target.files?.[0];
    console.log(file);
    if (!file) return;

    setIsOpen(true);
    const link = URL.createObjectURL(file);
    setImage(link);
  }

  useEffect(() => {
    if (!isOpen && image) URL.revokeObjectURL(image);
  }, [isOpen, image]);

  return (
    <div>
      <input
        accept=".jpeg,.png"
        type="file"
        id="avatarChange"
        className="hidden"
        onChange={onChange}
      />
      <label htmlFor="avatarChange">
        <div className="size-32 rounded-full overflow-hidden relative cursor-pointer bg-gray-500 flex items-center justify-center">
          {image ? (
            <Image
              src={image}
              alt="Profile photo"
              fill
              style={{ objectFit: "cover" }}
            />
          ) : (
            <Edit />
          )}
          <p className="sr-only">{"Change your avatar"}</p>
        </div>
      </label>
    </div>
  );
}
