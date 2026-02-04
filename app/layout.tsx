"use client";

import "./globals.css";
import { useState } from "react";
import { Data } from "./context/UserContext";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState("");

  return (
    <html lang="en">
      <body>
        <Data.Provider value={{ user, setUser }}>
          {children}
          <Toaster position="bottom-right" reverseOrder={false} />
        </Data.Provider>
      </body>
    </html>
  );
}
