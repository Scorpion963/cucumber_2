"use client"

import { createContext, useContext, useState } from "react"
import { createCurrentUserStore, CurrentUserStore } from "../stores/currentUserStore"
import {ReactNode} from 'react'
import { user } from "db"
import { useStore } from "zustand"

export type CurrentStoreApi = ReturnType<typeof createCurrentUserStore>

export const CurrentUserStoreContext = createContext<null | CurrentStoreApi>(null)

export type CurrentUserStoreProviderProps = {
    children: ReactNode,
    currentUser: typeof user.$inferSelect 
}

export function CurrentUserStoreProvider({children, currentUser} : CurrentUserStoreProviderProps) {
    const [store] = useState(() => createCurrentUserStore({currentUser}))
    
    return <CurrentUserStoreContext value={store}>
        {children}
    </CurrentUserStoreContext>
}

export function useCurrentUserStore<T>(selector: (store: CurrentUserStore) => T){ 
    const currentUserStoreContext = useContext(CurrentUserStoreContext)

    if(!currentUserStoreContext) throw new Error("useCurrentUserStore must be used within CurrentUserStoreProvider")

    return useStore(currentUserStoreContext, selector)
}
