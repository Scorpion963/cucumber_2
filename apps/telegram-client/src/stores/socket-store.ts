import {Socket} from 'socket.io-client'
import {createStore} from 'zustand/vanilla'

export type SocketState = {
    socket: Socket | null
}

export type SocketActions = {
    setSocket: (socket: Socket | null) => void
}

export type SocketStore = SocketState & SocketActions

const initState: SocketState = {
    socket: null
}

export const createSocketStore = (props = initState) => {
    return createStore<SocketStore>()(set => ({
        ...props,
       setSocket: (socket) => set((state) => ({...state, socket}))
    }))
}