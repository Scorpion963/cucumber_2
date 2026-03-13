import type { Socket } from "socket.io";

type ErrorType = {
  message: string;
  code: string;
};

export default function emitError(socket: Socket, eventName: string, error: ErrorType) {
  socket.emit("error", {
    event: eventName,
    error: { message: error.message, code: error.code },
  });
}