"use client";

import { UserContext } from "@/contexts/user-context";

export default function UserProvider({ user, children }) {
  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
}
