"use client"

import { ChangeEvent, useEffect } from "react";
import { useModal } from "../Modal";
import Image from "next/image";
import { Edit } from "lucide-react";

export default function AvatarChange({
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
