"use client";

import { useEffect, useState } from "react";

export interface AuthProfile {
  _id?: string;
  name: string;
  email: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  profile: AuthProfile | null;
}

const AUTH_CHANGED_EVENT = "freshcart-auth-changed";
const VERIFY_TOKEN_URL =
  "https://ecommerce.routemisr.com/api/v1/auth/verifyToken";

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
        _id?: string;
        id?: string;
        name?: string;
        email?: string;
      };

      if (parsed._id || parsed.id || parsed.name || parsed.email) {
        profile = {
          _id:
            parsed._id ??
            parsed.id ??
            window.localStorage.getItem("userId") ??
            undefined,
          name: parsed.name ?? window.localStorage.getItem("userName") ?? "",
          email: parsed.email ?? window.localStorage.getItem("userEmail") ?? "",
        };
      }
    } catch {
      profile = null;
    }
  }

  if (!profile) {
    const id = window.localStorage.getItem("userId") ?? undefined;
    const name = window.localStorage.getItem("userName") ?? "";
    const email = window.localStorage.getItem("userEmail") ?? "";

    if (id || name || email) {
      profile = { _id: id, name, email };
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
  window.localStorage.removeItem("userId");

  notifyAuthStateChanged();
}

export function useAuthState() {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    profile: null,
  });

  useEffect(() => {
    let isMounted = true;

    const syncAuthState = async () => {
      const baseState = readAuthState();

      if (!baseState.isLoggedIn) {
        if (isMounted) {
          setAuthState(baseState);
        }
        return;
      }

      const token =
        window.localStorage.getItem("userToken") ||
        window.localStorage.getItem("token");

      if (!token) {
        if (isMounted) {
          setAuthState(baseState);
        }
        return;
      }

      try {
        const response = await fetch(VERIFY_TOKEN_URL, {
          method: "GET",
          headers: {
            token,
          },
        });

        if (!response.ok) {
          if (isMounted) {
            setAuthState(baseState);
          }
          return;
        }

        const payload = (await response.json()) as {
          decoded?: { id?: string; name?: string };
        };

        const verifiedId = payload.decoded?.id ?? "";
        const verifiedName = payload.decoded?.name ?? "";

        if (verifiedId) {
          window.localStorage.setItem("userId", verifiedId);
        }

        if (verifiedName && !window.localStorage.getItem("userName")) {
          window.localStorage.setItem("userName", verifiedName);
        }

        if (isMounted) {
          setAuthState({
            isLoggedIn: true,
            profile: {
              _id: verifiedId || baseState.profile?._id,
              name: baseState.profile?.name || verifiedName,
              email: baseState.profile?.email || "",
            },
          });
        }
      } catch {
        if (isMounted) {
          setAuthState(baseState);
        }
      }
    };

    syncAuthState();

    window.addEventListener("storage", syncAuthState);
    window.addEventListener(AUTH_CHANGED_EVENT, syncAuthState);

    return () => {
      isMounted = false;
      window.removeEventListener("storage", syncAuthState);
      window.removeEventListener(AUTH_CHANGED_EVENT, syncAuthState);
    };
  }, []);

  return authState;
}
