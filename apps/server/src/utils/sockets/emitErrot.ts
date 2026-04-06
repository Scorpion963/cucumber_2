import type { Socket } from "socket.io";
import { SOCKET_ERRORS } from "../../event-listener-names";

export type ErrorPayload<T> = {
  message: string,
  code: string,
  data: T | null
}

type EventType = keyof typeof SOCKET_ERRORS

export default function emitError<T>(socket: Socket, eventName: EventType, error: ErrorPayload<T>) {
  socket.emit(eventName, error);
}