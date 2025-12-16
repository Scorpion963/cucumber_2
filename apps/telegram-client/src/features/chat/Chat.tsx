import { Avatar } from "@/components/ui/avatar"

export default function Chat() {
    return <div>
        <ChatHeader />
        <ChatContent />
        <ChatInput />
    </div>
}

function ChatHeader() {
    return <div className="w-full flex gap-2 px-4  items-center py-1 border-b">
        <div className="size-9 rounded-full bg-white"></div>
        <div className="">
            <div className="text-ellipsis">Egor</div>
            <div className="text-sm text-muted-foreground text-ellipsis">last seen 39 minutes ago</div>
        </div>
    </div>
}

function ChatContent() {
    return <div></div>
}

function ChatInput() {
    return <div></div>
}