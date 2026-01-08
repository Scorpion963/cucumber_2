"use client";
import {
  createContext,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

import { createPortal } from "react-dom";
import { Button } from "./ui/button";
import useMounted from "@/hooks/useMounted";

type ModalProps = {
  defaultOpen?: boolean;
  children: React.ReactNode;
};

type ModalContextProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
};

const ModalContext = createContext<ModalContextProps | null>(null);

export function useModal() {
  const values = useContext(ModalContext);

  if (values === null)
    throw new Error("useModal must be used inside the Modal component");

  return values;
}

export function Modal({ defaultOpen = false, children }: ModalProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <ModalContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </ModalContext.Provider>
  );
}

export function Overlay() {
  return <div className="bg-black/50 fixed inset-0" />;
}

export function ModalContent({ children }: { children: React.ReactNode }) {
  const { isOpen, setIsOpen } = useModal();
  const [mounted, setMounted] = useMounted();

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }

    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, setIsOpen]);

  if (!mounted) return null;

  return createPortal(
    isOpen && (
      <>
        <Overlay />
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 flex items-center justify-center"
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        </div>
      </>
    ),
    document.body
  );
}

export function ModalTriggerButton({
  children,
  ...props
}: { children: React.ReactNode } & React.ComponentProps<"button">) {
  const { setIsOpen } = useModal();

  return (
    <Button onClick={() => setIsOpen(true)} {...props}>
      {children}
    </Button>
  );
}
