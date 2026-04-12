import useMounted from "@/hooks/useMounted";
import { AnimatePresence } from "framer-motion";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type CoordinatesType = {
  x: number;
  y: number;
};

type ContextMenuPopupType = {
  handleContextMenu: (e: React.MouseEvent, id: string) => void;
  coordinates: CoordinatesType | null;
  selectedItem: string | null;
  setSelectedItem: Dispatch<SetStateAction<string | null>>;
};

const ContextMenuPopupContext = createContext<ContextMenuPopupType | null>(
  null,
);

export function useContextMenuPopup() {
  const context = useContext(ContextMenuPopupContext);

  if (!context)
    throw new Error(
      "useContextMenuPopup must be used only within ContextMenuPopup!",
    );

  return context;
}

export function ContextMenuPopup({ children }: { children: ReactNode }) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [mounted, setMounted] = useMounted();
  const [coordinates, setCoordinates] = useState<CoordinatesType | null>(null);

  if (!mounted) return null;

  function handleContextMenu(e: React.MouseEvent, id: string) {
    e.preventDefault();
    if (id === selectedItem) {
      setSelectedItem(null);
      return;
    }
    setSelectedItem(id);
    setCoordinates({ x: e.clientX, y: e.clientY });
    console.log("Client X: ", e.clientX);
    console.log("Client Y: ", e.clientY);
  }

  return (
    <ContextMenuPopupContext.Provider
      value={{ handleContextMenu, coordinates, selectedItem, setSelectedItem }}
    >
      {children}
    </ContextMenuPopupContext.Provider>
  );
}

export function PopupContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { coordinates, selectedItem, setSelectedItem } = useContextMenuPopup();

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const listener = (e: MouseEvent) => {
      // const target = e.target as Node;

      // if (!ref.current?.contains(target)) {
      //   setSelectedItem(null);
      // }
      setSelectedItem(null)
    };

    document.addEventListener("click", listener);

    return () => document.removeEventListener("click", listener);
  }, [setSelectedItem]);

  return (
    <AnimatePresence>
      {selectedItem && coordinates && (
        <motion.div
          className="fixed"
          style={{
            left: coordinates.x,
            top: coordinates.y,
            transformOrigin: "top left",
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 100, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          ref={ref}
        >
          <div
            className={cn(
              "w-44 rounded-lg z-50 absolute p-1 bg-accent flex flex-col",
              className,
            )}
          >
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ContextMenuTrigger({
  children,
  id,
}: {
  children: ReactNode;
  id: string;
}) {
  const { handleContextMenu } = useContextMenuPopup();

  return <div onContextMenu={(e) => handleContextMenu(e, id)}>{children}</div>;
}
