import { AnimatePresence } from "framer-motion";
import {motion} from 'framer-motion'
import { Check } from "lucide-react";

export default function SuccessButton({condition}: {condition: boolean}) {
  return (
    <div className="h-6">
      <AnimatePresence>
        {condition && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex gap-2 text-green-400"
          >
            <Check />
            <span>Success</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}