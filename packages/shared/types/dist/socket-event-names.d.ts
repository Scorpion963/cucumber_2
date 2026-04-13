export declare const ClientToServerEvents: {
    readonly SEND_TEXT_MESSAGE: "SEND_TEXT_MESSAGE";
    readonly CREATE_CHATROOM: "CREATE_CHATROOM";
    readonly DELETE_CHATROOM: "DELETE_CHATROOM";
};
export declare const ServerToClientEvents: {
    readonly MESSAGE_CREATED: "MESSAGE_CREATED";
    readonly ACK_MESSAGE_CREATED: "ACK_MESSAGE_CREATED";
    readonly NEW_CHAT_ROOM_CREATED: "NEW_CHAT_ROOM_CREATED";
    readonly CHATROOM_DELETED: "CHATROOM_DELETED";
};
export declare const ServerToClientErrors: {
    readonly CHAT_CREATION_FAILED: "CHAT_CREATION_FAILED";
    readonly MESSAGE_CREATION_ERROR: "MESSAGE_CREATION_ERROR";
    readonly CHAT_DELETION_FAILED: "CHAT_DELETION_FAILED";
};
export type ErrorPayload<T> = {
    code: string;
    message: string;
    data: T;
};
//# sourceMappingURL=socket-event-names.d.ts.map