"use client";

import { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";

type Movie = { id: number; name: string };

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [name, setName] = useState<string>(""); // For adding a new movie
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState<string>(""); // For editing a movie

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
    setName(""); // Clear input after adding
  }

  async function deleteMovies(id: number) {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/delete/${id}`, {
      method: "DELETE",
    });
    getMovies(); // Refresh the movie list after deletion
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
    if (Array.isArray(data.movies)) {
      setMovies(data.movies);
    } else {
      console.error("Unexpected response format:", data);
    }
    setEditingId(null);
    setEditingName("");
  }

  useEffect(() => {
    getMovies();
  }, []);

  return (
    <div>
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

      {/* Movie List Section */}
      <div className="bg-white shadow-md p-6 rounded">
        <h2 className="text-2xl font-semibold mb-4">Movie List</h2>
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="flex items-center justify-between mb-4"
          >
            {editingId === movie.id ? (
              <input
                className="flex-1 p-2 border rounded mr-4"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
              />
            ) : (
              <span className="text-lg font-medium">{movie.name}</span>
            )}

            <div className="flex gap-2">
              {editingId === movie.id ? (
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  onClick={() => updateMovies(movie.id)}
                >
                  Save
                </button>
              ) : (
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  onClick={() => {
                    setEditingId(movie.id);
                    setEditingName(movie.name); // Set the editing name
                  }}
                >
                  Edit
                </button>
              )}
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => deleteMovies(movie.id)}
              >
                Delete
              </button>
              ;
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
