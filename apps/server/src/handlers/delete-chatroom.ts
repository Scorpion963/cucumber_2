import type { Socket, Server } from "socket.io";
import z from "zod";
import emitError from "../utils/sockets/emitErrot";
import { chatMember, chats, db } from "db";
import { eq } from "drizzle-orm";
import { SOCKET_EMITS } from "../event-listener-names";

//TODO: Unsafe deletion since i'm not checking the id of who deletes the chat

const requestSchema = z.object({id: z.string()})

export default async function deleteChatroomHandler(socket: Socket, io: Server, requestData: unknown){
    const {data, success} = requestSchema.safeParse(requestData)

    if(!success){
        console.error("Error inside of deleteChatroomhandler: Invalid data")
        emitError(socket, "CHAT_DELETION_FAILED", {code: "INVALID_DATA", data: data,  message: "Error: Invalid requeest data"})
        return 
    }

    try{
        const deletedChat = await db.delete(chats).where(eq(chats.id, data.id)).returning()
        const room = io.sockets.adapter.rooms.get(data.id)
        io.to(`room:${data.id}`).emit(SOCKET_EMITS.CHATROOM_DELETED, {id: data.id})
    }catch (e){
        console.error("Error inside of deleteChatroomhandler: ", e)
        emitError(socket, "CHAT_DELETION_FAILED", {code: "SERVER_ERROR", data: data, message: "Error: Internal server error"})
    }
}