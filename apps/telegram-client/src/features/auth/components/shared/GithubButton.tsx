import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";

export default function GithubButton({
  ...props
}: React.ComponentProps<"button">) {
  return (
    <Button
      type="button"
      variant={"outline"}
      className="w-auto cursor-pointer"
      {...props}
    >
      <FaGithub />
      <p className="sr-only">Sign in with Github</p>
    </Button>
  );
}
