"use client";

import { useState, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Data } from "./context/UserContext";

type Mode = "login" | "register";

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const context = useContext(Data);

  if (!context) {
    throw new Error("AuthPage must be used within Data.Provider");
  }

  const { setUser } = context;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint =
        mode === "login"
          ? "https://task-management-backend-2etr.onrender.com/login"
          : "https://task-management-backend-2etr.onrender.com/register";

      const res = await axios.post(endpoint, { email, password });

      if (mode === "login") {
        localStorage.setItem("user", JSON.stringify(res.data));
        setUser(res.data.email);
        router.push("/home");
      } else {
        setMode("login");
        setError("Registration successful. Please login.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || `${mode} failed`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-400 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">
          {mode === "login" ? "Login" : "Register"}
        </h2>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2.5 rounded-lg cursor-pointer"
          >
            {loading
              ? mode === "login"
                ? "Logging in..."
                : "Registering..."
              : mode === "login"
              ? "Login"
              : "Register"}
          </button >
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => {
                  setMode("register");
                  setError("");
                }}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
