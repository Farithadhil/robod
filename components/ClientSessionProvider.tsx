"use client"; // Mark this file as a Client Component

import React from "react";
import { SessionProvider } from "next-auth/react";

export default function ClientSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
