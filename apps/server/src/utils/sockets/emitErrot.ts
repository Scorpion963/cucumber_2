import type { Socket } from "socket.io";
import { ServerToClientErrors } from "types";

export type ErrorPayload<T> = {
  message: string,
  code: string,
  data: T | null
}

type EventType = keyof typeof ServerToClientErrors

export default function emitError<T>(socket: Socket, eventName: EventType, error: ErrorPayload<T>) {
  socket.emit(eventName, error);
}