"use client"

import { createContext, ReactNode, useContext } from "react";

export type ChatScrollAreaContextType = {
  scrollToBottom: () => void;
};

export const ChatScrollAreaContext =
  createContext<null | ChatScrollAreaContextType>(null);

export type ChatScrollAreaContextProps = {
  children: ReactNode;
  scrollToBottom: () => void;
};

export function ChatScrollAreaProvider({
  children,
  scrollToBottom,
}: ChatScrollAreaContextProps) {
  return (
    <ChatScrollAreaContext.Provider value={{ scrollToBottom }}>
      {children}
    </ChatScrollAreaContext.Provider>
  );
}

export function useChatScrollArea(){
    const chatScrollArea = useContext(ChatScrollAreaContext)

    if(!chatScrollArea) throw new Error("useChatScrollArea must be used only within ChatScrollAreaProvider")

    return chatScrollArea
}