"use client";

import { useEffect, useState } from "react";

export interface AuthProfile {
  name: string;
  email: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  profile: AuthProfile | null;
}

const AUTH_CHANGED_EVENT = "freshcart-auth-changed";

function readAuthState(): AuthState {
  if (typeof window === "undefined") {
    return {
      isLoggedIn: false,
      profile: null,
    };
  }

  const token =
    window.localStorage.getItem("userToken") ||
    window.localStorage.getItem("token");

  const userData = window.localStorage.getItem("userData");
  let profile: AuthProfile | null = null;

  if (userData) {
    try {
      const parsed = JSON.parse(userData) as {
        name?: string;
        email?: string;
      };

      if (parsed.name || parsed.email) {
        profile = {
          name: parsed.name ?? window.localStorage.getItem("userName") ?? "",
          email: parsed.email ?? window.localStorage.getItem("userEmail") ?? "",
        };
      }
    } catch {
      profile = null;
    }
  }

  if (!profile) {
    const name = window.localStorage.getItem("userName") ?? "";
    const email = window.localStorage.getItem("userEmail") ?? "";

    if (name || email) {
      profile = { name, email };
    }
  }

  return {
    isLoggedIn: Boolean(token),
    profile,
  };
}

export function notifyAuthStateChanged() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export function clearAuthStorage() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem("userToken");
  window.localStorage.removeItem("token");
  window.localStorage.removeItem("userName");
  window.localStorage.removeItem("userEmail");
  window.localStorage.removeItem("userData");

  notifyAuthStateChanged();
}

export function useAuthState() {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    profile: null,
  });

  useEffect(() => {
    const syncAuthState = () => {
      setAuthState(readAuthState());
    };

    syncAuthState();

    window.addEventListener("storage", syncAuthState);
    window.addEventListener(AUTH_CHANGED_EVENT, syncAuthState);

    return () => {
      window.removeEventListener("storage", syncAuthState);
      window.removeEventListener(AUTH_CHANGED_EVENT, syncAuthState);
    };
  }, []);

  return authState;
}
