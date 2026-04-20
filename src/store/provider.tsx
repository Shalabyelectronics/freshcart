"use client";

import { Provider } from "react-redux";
import { SessionProvider } from "next-auth/react";

import { store } from "@/store";

interface StoreProviderProps {
  children: React.ReactNode;
}

export default function StoreProvider({ children }: StoreProviderProps) {
  return (
    <SessionProvider>
      <Provider store={store}>{children}</Provider>
    </SessionProvider>
  );
}
