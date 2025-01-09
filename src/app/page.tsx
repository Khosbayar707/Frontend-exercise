"use client";

import { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";

type Movie = { id: number; name: string };

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [name, setName] = useState<string>("");
  const [editingName, setEditingName] = useState<string>("");

  async function getMovies() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}`);
    const data = await res.json();
    setMovies(data);
  }

  async function createMovies() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/create`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
      }),
    });
    const data = await res.json();
    setMovies(data);
    setName("");
  }

  async function deleteMovies(id: number) {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/delete/${id}`, {
      method: "DELETE",
    });
    getMovies();
  }

  async function updateMovies(id: number) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/update/${id}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editingName,
        }),
      }
    );
    const data = await res.json();
    setEditingName("");
  }

  useEffect(() => {
    getMovies();
  }, []);

  return (
    <div className="text-black">
      <input
        className="flex-1 p-2 border rounded"
        placeholder="Enter movie name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={createMovies}
      >
        Add
      </button>
      <div className="bg-white p-6 rounded">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="flex items-center justify-between mb-4"
          >
            <input
              className="flex-1 p-2 border rounded mr-4"
              defaultValue={movie.name}
              onChange={(e) => setEditingName(e.target.value)}
            />

            <div className="flex gap-2">
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded"
                onClick={() => updateMovies(movie.id)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => deleteMovies(movie.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
