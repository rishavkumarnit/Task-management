"use client";

import { createContext } from "react";

type UserContextType = {
  user: string;
  setUser: React.Dispatch<React.SetStateAction<string>>;
};

export const Data = createContext<UserContextType | undefined>(undefined);
