import removeUndefined from "@/lib/removeUndefined"
import { user } from "db"
import { createStore } from "zustand/vanilla"

export type CurrentUserState = {
    currentUser: typeof user.$inferSelect  
}

export type CurrentUserActions = {
    updateUser: (userToUpdate: Partial<typeof user.$inferSelect>) => void
}

export type CurrentUserStore = CurrentUserState & CurrentUserActions

export const createCurrentUserStore = (initState: CurrentUserState) => {
    return createStore<CurrentUserStore>()(set => ({
        ...initState,
        updateUser: (userToUpdate) => {
            const cleanObject: Partial<typeof user.$inferSelect> = removeUndefined(userToUpdate) 
            console.log("Clean object: ", cleanObject)
            set(prev => ({...prev, currentUser: {...prev.currentUser, ...cleanObject}}))      
        }
    }))
}