import Image from "next/image";

export function UserImage({
  name,
  isOnline,
  imageUrl,
}: {
  name: string;
  isOnline?: boolean;
  imageUrl?: string | null;
}) {
  return (
    <div className="w-full flex gap-4 flex-col items-center">
      <div className="size-32 bg-gray-500 rounded-full relative overflow-hidden">
        {imageUrl && (
          <Image
            fill
            src={imageUrl}
            style={{ objectFit: "cover" }}
            alt={`{name}'s profile image`}
          />
        )}
      </div>
      <div className="flex flex-col items-center">
        <div className="font-bold text-lg">{name}</div>
        {isOnline && (
          <div className="text-sm text-muted-foreground">
            {isOnline ? "online" : "offline"}
          </div>
        )}
      </div>
    </div>
  );
}
