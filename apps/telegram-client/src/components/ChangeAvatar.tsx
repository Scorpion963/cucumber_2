import { Edit } from "lucide-react";
import { ControllerFieldState } from "react-hook-form";

export default function ChangeAvatar({
  labelContent,
  fieldState,
  ...props
}: {
  labelContent: string;
  fieldState: ControllerFieldState;
} & React.ComponentProps<"input">) {
  return (
    <div>
      <input
        accept=".jpeg,.png"
        type="file"
        id="avatarChange"
        className="hidden"
        onChange={props.onChange}
        {...props}
      />
      <label htmlFor="avatarChange">
        <div className="size-32 rounded-full cursor-pointer bg-gray-500 flex items-center justify-center">
          <Edit className="size-16" />
          <p className="sr-only">{labelContent}</p>
        </div>
      </label>
    </div>
  );
}
