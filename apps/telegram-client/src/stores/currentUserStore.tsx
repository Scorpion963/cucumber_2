import { user } from "db"
import { createStore } from "zustand/vanilla"

export type CurrentUserState = {
    currentUser: typeof user.$inferSelect  
}

export type CurrentUserActions = {
    udpateUser: (userToUpdate: Partial<typeof user.$inferSelect>) => void
}

export type CurrentUserStore = CurrentUserState & CurrentUserActions

export const createCurrentUserStore = (initState: CurrentUserState) => {
    return createStore<CurrentUserStore>()(set => ({
        ...initState,
        udpateUser: (userToUpdate) => {
            const cleanObject: Partial<typeof user.$inferSelect> = removeUndefined(userToUpdate) 
            set((prev) => ({...prev, ...cleanObject}))
        }
    }))
}

function removeUndefined<T extends object>(obj: Partial<T>) {
    const result: Partial<T> = {}
    
    for(const key of Object.keys(obj) as (keyof T)[]){
        const value = obj[key]

        if(value !== undefined){
            result[key] = value
        }
    }

    return result
}