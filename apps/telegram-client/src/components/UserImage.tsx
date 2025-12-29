export function UserImage({
  name,
  isOnline,
}: {
  name: string;
  isOnline?: boolean;
}) {
  return (
    <div className="w-full flex gap-4 flex-col items-center">
      <div className="size-32 bg-gray-500 rounded-full"></div>
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
