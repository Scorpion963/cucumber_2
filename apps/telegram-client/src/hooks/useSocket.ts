"use client"

import { io, Socket } from "socket.io-client";
import { useAuthToken } from "./useAuthToken";
import { useEffect, useState } from "react";

export function useSocket() {
  const token = useAuthToken();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const connect = async () => {
      if(!token) {
        setSocket(null)
        return
      }

      const socketInstance = io("http://localhost:3001/", {
        auth: { token: token },
      });

      setSocket(socketInstance);
    };

    connect();

    return () => {
      socket?.disconnect();
    };
  }, [token]);

  return socket;
}