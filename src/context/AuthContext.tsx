import React, { createContext, useContext, useState } from "react";
import type { User } from "../types"; 

interface UserContextValue {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("mockUser");
    if (!storedUser) return null;

    try {
      const parsed = JSON.parse(storedUser);
      if (
        parsed &&
        typeof parsed === "object" &&
        "id" in parsed &&
        "username" in parsed
      ) {
        return parsed as User;
      }
    } catch (err) {
      console.error("خطا در خواندن mockUser:", err);
    }

    localStorage.removeItem("mockUser"); 
    return null;
  });

  const updateUser = (newUser: User | null) => {
    if (newUser) {
      localStorage.setItem("mockUser", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("mockUser");
    }
    setUser(newUser);
  };

  const logout = () => updateUser(null);

  return (
    <UserContext.Provider value={{ user, setUser: updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}