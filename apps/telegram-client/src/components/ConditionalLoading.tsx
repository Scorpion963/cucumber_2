import { ReactNode } from "react";
import { ImSpinner8 } from "react-icons/im";

export default function ConditionalLoading({
  isLoading,
  children,
}: {
  isLoading: boolean;
  children: ReactNode;
}) {
  return isLoading ? <ImSpinner8 className="animate-spin" /> : children;
}