"use client";

import { FixedCropperWithSlider } from "@/components/FixedCropperWithSlider";
import { Modal, ModalContent } from "@/components/Modal";
import { CircleStencil, ImageRestriction } from "react-advanced-cropper";

export default function Page() {
  return (
    <div>
      <Modal defaultOpen={true}>
        <ModalContent>
          <FixedCropperWithSlider
            stencilSize={{ width: 400, height: 400 }}
            src={
              "https://images.unsplash.com/photo-1762692496722-de2a899e3af5?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
      </Modal>
    </div>
  );
}
