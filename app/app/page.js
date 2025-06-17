"use client";
import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setAnime(null);
    try {
      const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.data && data.data.length > 0) {
        setAnime(data.data[0]);
      } else {
        setError("Anime tidak ditemukan.");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat mengambil data.");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-gray-800 text-white p-4">
      <h1 className="text-4xl font-extrabold mb-8 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-lg">Cari Anime</h1>
      <form onSubmit={handleSearch} className="mb-10 flex flex-col sm:flex-row gap-3 w-full max-w-xl">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Masukkan judul anime..."
          className="p-3 rounded-lg text-black w-full focus:outline-none focus:ring-2 focus:ring-blue-400 border border-gray-300 shadow-sm transition"
          required
        />
        <button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 rounded-lg font-bold text-white shadow-md hover:scale-105 hover:from-blue-500 hover:to-purple-500 transition-all duration-200">Cari</button>
      </form>
      {loading && <p className="text-blue-300 animate-pulse">Mencari...</p>}
      {error && <p className="text-red-400 font-semibold mb-4">{error}</p>}
      {anime && (
        <div className="bg-gray-900/80 p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-2xl border border-gray-700 transition-all duration-300">
          <img src={anime.images.jpg.large_image_url} alt={anime.title} className="w-64 h-80 object-cover rounded-xl mb-6 shadow-lg border-4 border-blue-700/30" />
          <h2 className="text-3xl font-bold mb-2 text-blue-300 text-center drop-shadow">{anime.title}</h2>
          <p className="mb-4 text-gray-200 text-center max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-700/40 scrollbar-track-gray-800/40">
            {anime.synopsis || "Sinopsis tidak tersedia."}
          </p>
          <p className="font-semibold text-lg text-purple-300">Rating: <span className="text-white">{anime.score || "-"}</span></p>
        </div>
      )}
    </main>
  );
}
