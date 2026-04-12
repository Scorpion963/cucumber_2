import type { Socket, Server } from "socket.io";
import z from "zod";

//TODO: Unsafe deletion since i'm not checking the id of who deletes the chat

// const requestSchema = z.object({chatId: })

export default function deleteChatroomHandler(socket: Socket, io: Server, requestData: unknown){
}