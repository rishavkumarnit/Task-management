"use client";

import Navbar from "../components/Navbar";
import { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { setMaxIdleHTTPParsers } from "http";

type Task = {
  id: string;
  description: string;
  completed: boolean;
};

export default function Home() {
  const router = useRouter();

  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  const refreshAccessToken = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await axios.post("https://task-management-backend-2etr.onrender.com/refresh", {
        token: user.refreshToken,
      });
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          accessToken: res.data.accessToken,
        }),
      );
      toast.success("Token refreshed. Please try again.");
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  };

  const fetchTasks = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await axios.get("https://task-management-backend-2etr.onrender.com/tasks", {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      });
      setTasks(res.data.tasks);
      setFilteredTasks(res.data.tasks);
    } catch (error: any) {
      if (error.response?.data?.code === "TOKEN_EXPIRED") {
        router.push("/");
      }
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/");
      return;
    }
    fetchTasks();
  }, []);

  const handleAdd = async () => {
    if (!taskInput.trim()) {
      alert("Task description cannot be empty");
      return;
    }
    if (editId) {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const res = await axios.patch(
          `https://task-management-backend-2etr.onrender.com/tasks/${editId}`,
          { description: taskInput },
          {
            headers: {
              Authorization: `Bearer ${user?.accessToken}`,
            },
          },
        );
        setTasks((prev) => [res.data, ...prev]);
        setFilteredTasks((prev) => [res.data, ...prev]);
        setTaskInput("");
        setEditId(null);
        toast.success("Task updated successfully!");
      } catch (err: any) {
        const backendCode = err?.response?.data?.code;
        if (backendCode === "TOKEN_EXPIRED") {
          alert("Session expired. Refreshing token...please try again.");
          refreshAccessToken();
          return;
        }
        console.log("Full error:", err);
      }
      return;
    }

    // add normal task
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user) {
        router.push("/");
        return;
      }
      const res = await axios.post(
        "https://task-management-backend-2etr.onrender.com/tasks",
        { description: taskInput },
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        },
      );
      setTasks((prev) => [res.data, ...prev]);
      setFilteredTasks((prev) => [res.data, ...prev]);
      setTaskInput("");
      toast.success("Task added successfully!");
    } catch (err: any) {
      const backendCode = err?.response?.data?.code;
      if (backendCode === "TOKEN_EXPIRED") {
        alert("Session expired. Refreshing token...please try again.");
        refreshAccessToken();
        return;
      }
      console.log("Full error:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      await axios.delete(`https://task-management-backend-2etr.onrender.com/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      });
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setFilteredTasks((prev) => prev.filter((t) => t.id !== id));
      toast.success("Task deleted successfully!");
    } catch (err: any) {
      const backendCode = err?.response?.data?.code;
      if (backendCode === "TOKEN_EXPIRED") {
        alert("Session expired. Refreshing token...please try again.");
        refreshAccessToken();
        return;
      }
      console.error(err);
    }
  };

  const handleCheckbox = async (id: string) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await axios.patch(
        `https://task-management-backend-2etr.onrender.com/tasks/${id}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        },
      );
      setTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)));
      setFilteredTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)));
      toast.success("Task toggled successfully!");
    } catch (err: any) {
      const backendCode = err?.response?.data?.code;
      if (backendCode === "TOKEN_EXPIRED") {
        alert("Session expired. Refreshing token...please try again.");
        refreshAccessToken();
        return;
      }
      console.error(err);
    }
  };

  const handleEdit = async (id: string) => {
    const t = tasks.filter((i) => i.id == id);
    if (t[0].completed) {
      alert("Completed task cannot be edited");
      return;
    }
    setTaskInput(t[0].description);
    const newTasks = tasks.filter((item) => {
      return item.id !== id;
    });
    setTasks(newTasks);
    setFilteredTasks(newTasks);
    setEditId(id);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTaskInput(e.target.value);
  };

  const handleSearch = () => {
    if (!search.trim()) {
      setFilteredTasks(tasks);
      return;
    }
    const newList = tasks.filter((item) =>
      item.description.toLowerCase().includes(search.toLowerCase()),
    );
    setFilteredTasks(newList);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div>
      <Navbar />
      <div className="pt-16 bg-slate-400 min-h-screen px-6">
        <h2 className="text-lg font-semibold mb-4">Add Task</h2>
        <input
          type="text"
          value={taskInput}
          onChange={handleChange}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
            e.key === "Enter" && handleAdd()
          }
          className="w-full p-2 rounded bg-gray-200 text-black"
        />
        <button
          onClick={handleAdd}
          className="mt-2 bg-green-400 px-4 py-1 rounded"
        >
          Save
        </button>
        <h2 className="mt-2 text-center font-semibold">Your Tasks</h2>
        <div className="my-8 flex  justify-center items-center gap-2">
          <input
            type="text"
            name="search"
            value={search}
            onSubmit={handleSearch}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
              e.key === "Enter" && handleSearch()
            }
            onChange={(e) => handleSearchChange(e)}
            className="text-black  bg-cyan-100 h-10 w-[30%] border border-cyan-400 items-center justify-center text-center opacity-75 p-2 rounded-3xl"
          />
          <button
            onSubmit={handleSearch}
            onClick={handleSearch}
            className="rounded-full h-10 w-10 border font-medium flex justify-center items-center border-green-400 hover:cursor-pointer opacity-75 bg-green-100"
          >
            <img
              src="/search-2911.png"
              className="h-5 w-5 active:scale-90 active:translate-z-1"
              alt=""
            />
          </button>
        </div>
        <div className="mt-4 space-y-3 h-90 overflow-y-auto">
          {filteredTasks.map((item) => {
            return (
              <div
                key={item.id}
                className="todo flex flex-col items-start mx-10 mt-3"
              >
                <div
                  className={`text-black bg-gray-200 rounded w-full p-1 ${
                    item.completed ? "line-through" : ""
                  }`}
                >
                  {item.description}
                </div>
                <input
                  type="checkbox"
                  name={item.id}
                  onChange={() => handleCheckbox(item.id)}
                  className="mt-0.5 hover:cursor-pointer"
                  checked={item.completed}
                  id=""
                />
                <div className="buttons flex mt-0.5 gap-1">
                  <button
                    onClick={() => handleEdit(item.id)}
                    className="rounded-sm bg-red-300 shadow w-18 active:scale-95 active:translate-z-1 mt-1 hover:cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="rounded-sm bg-red-500 shadow w-18 active:scale-95 active:translate-z-1 mt-1 hover:cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
