"use client";

import { useState, useEffect } from "react";

type Movie = { id: number; name: string };

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [name, setName] = useState<string>("");

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
  }

  async function deleteMovies(id: number) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/delete/${id}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    const updatedMovies = movies.filter((movie) => movie.id !== id);
    setMovies(updatedMovies);
  }

  async function updateMovies() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/update`, {
      method: "PUT",
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
  }

  useEffect(() => {
    getMovies();
  }, []);

  console.log(name);
  return (
    <div>
      <div>
        CREATE
        <input
          placeholder="Name..."
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <button
          onClick={() => {
            createMovies();
          }}
        >
          Ok
        </button>
      </div>
      <div>
        DELETE
        {movies.map((movie) => (
          <div key={movie.id} className="flex gap-8">
            {movie.name}
            <button
              onClick={() => {
                deleteMovies(movie.id);
              }}
            >
              delete
            </button>
          </div>
        ))}
      </div>
      <div>
        EDIT
        {movies.map((movie) => (
          <div key={movie.id} className="flex gap-8">
            {movie.name}
            <button
              onClick={() => {
                updateMovies(movie.id);
              }}
            >
              submit
            </button>
          </div>
        ))}
      </div>

      {/* {movies.map((movie) => (
        <div key={movie.id}>{movie.name}</div>
      ))} */}
    </div>
  );
}
