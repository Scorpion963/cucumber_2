import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function FloatingInput({
  labelContent,
  ...props
}: React.ComponentProps<"input"> & { labelContent: string }) {
  return (
    <FormItem className="relative">
      <FormControl>
        <Input
          placeholder="First Name"
          className="peer dark:bg-background focus:bg-background placeholder:text-transparent p-5 rounded-lg dark:text-[1rem]"
          {...props}
        />
      </FormControl>
      <FormLabel className="peer-focus:bottom-9 text-[1rem] bottom-2 transition-all bg-background px-1 peer-focus:text-xs absolute left-4 peer-not-placeholder-shown:bottom-9 peer-not-placeholder-shown:text-xs text-muted-foreground">
        {labelContent}
      </FormLabel>
    </FormItem>
  );
}