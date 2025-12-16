import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";

export default function GoogleButton({...props}: React.ComponentProps<"button">) {
  return (
    <Button
      type="button"
      variant={"outline"}
      className="w-auto cursor-pointer"
      {...props}
    >
      <FaGoogle />
      <p className="sr-only">Sign in with Google</p>
    </Button>
  );
}
