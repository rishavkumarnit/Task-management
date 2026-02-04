"use client";

import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useRouter } from "next/navigation";
import { Data } from "../context/UserContext";

const Profile = () => {
  const [storedUser, setStoredUser] = useState<any>(null);
  const router = useRouter();
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/");
      return;
    }
    const parsed = JSON.parse(user);
    setStoredUser(parsed);
  }, []);
  const context = useContext(Data);

  if (!context) {
    throw new Error("AuthPage must be used within Data.Provider");
  }

  const { setUser } = context;
  // const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  // if (!storedUser) {
  //   router.push("/");
  //   return;
  // }

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser("");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-slate-400 flex flex-col ">
      <div className="bg-white shadow-md mt-2flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-700">Profile</h1>
        <div />
      </div>
      <div className="flex-grow flex justify-center items-start p-6">
        <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-700 text-center">
            Profile
          </h2>
          <div className="space-y-1">
            <label className="text-sm text-gray-600">Email</label>
            <input
              name="email"
              value={storedUser?.email || ""}
              readOnly
              className="w-full px-4 py-2 border border-gray-200 bg-gray-100 rounded-lg text-black/50"
            />
          </div>
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleLogout}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg transition cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default Profile;
