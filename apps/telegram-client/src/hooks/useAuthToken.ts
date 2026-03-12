"use client"

import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";

export function useAuthToken() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const getToken = async () => {
      const session = await authClient.getSession();
      setToken(session.data?.session.token ?? null);
    };

    getToken();
  }, []);

  return token;
}