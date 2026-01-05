"use client"

import { useHomeChatsStore } from "@/providers/user-store-provider"
import { useMemo } from "react"

export default function useHomeChatsArray() {
    const chats = useHomeChatsStore(state => state.chats)

    return useMemo(() => Array.from(chats.values()), [chats])
}