"use client";

import FixedCircularCropper from "@/components/FixedCropper";
import { Modal, ModalContent } from "@/components/Modal";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div>
      <Modal defaultOpen={true}>
        <ModalContent>
          <div className="flex flex-col bg-background p-6 gap-4 rounded-lg">
            <h1 className="font-bold text-2xl">Drag to reposition</h1>
            <div className="max-w-120 w-full h-full overflow-hidden ">
              <FixedCircularCropper />
            </div>

            <Button>Confirm</Button>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
}
