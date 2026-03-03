"use client"

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import ConditionalLoading from "../ConditionalLoading";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";

export default function SaveButton({
  isSubmitting,
  isSuccess,
  disabed,
}: {
  isSubmitting: boolean;
  isSuccess: boolean;
  disabed: boolean;
}) {
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      setShowSaved(true);

      const timer = setTimeout(() => setShowSaved(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  return (
    <div>
      <Button className={`w-full ${showSaved && "disabled:opacity-100"}`} disabled={disabed}>
        <ConditionalLoading isLoading={isSubmitting}>
          <AnimatePresence mode="wait">
            {showSaved ? (
              <motion.span
              key={1}
              className="flex items-center gap-2"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{duration: 0.15}}
              >
                <Check /> Saved
              </motion.span>
            ) : (
              <motion.span
              className=""
              key={2}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{duration: 0.15}}
              >
                Save
              </motion.span>
            )}
          </AnimatePresence>
        </ConditionalLoading>
      </Button>
    </div>
  );
}