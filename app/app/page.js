"use client";
import { useState } from "react";

function ReviewCard({ review, onShowMore, isFull, onBack }) {
  const maxLength = 180;
  const isLong = review.review.length > maxLength;
  if (isFull) {
    // Card horizontal, persegi panjang landscape, overlay dengan background blur, responsif
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onBack}></div>
        <div className="relative bg-yellow-50 border-4 border-black shadow-[8px_8px_0_0_#000] rounded-none flex flex-row items-center w-full max-w-3xl min-h-[120px] h-auto p-2 sm:p-4 gap-2 sm:gap-6 animate-fadeIn z-10 mx-2 sm:mx-4">
          <img src={review.user.images.jpg.image_url} alt={review.user.username} className="w-12 h-12 sm:w-20 sm:h-20 rounded-full border-2 border-black flex-shrink-0 object-cover" />
          <div className="flex flex-col flex-1 min-w-0">
            <span className="font-bold text-black text-base sm:text-lg mb-1 truncate">{review.user.username}</span>
            <div className="text-black font-semibold text-xs sm:text-sm whitespace-pre-line mb-1 break-words max-h-32 sm:max-h-40 overflow-y-auto">
              {review.review}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Score: <span className="font-bold text-black">{review.score}</span></div>
          </div>
          <button
            className="absolute top-2 right-2 bg-pink-500 border-2 border-black px-2 sm:px-3 py-1 rounded-none font-bold text-black shadow-[2px_2px_0_0_#000] hover:bg-pink-400 transition"
            onClick={onBack}
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }
  // Card ringkas
  return (
    <div className="bg-yellow-50 border-4 border-black shadow-[4px_4px_0_0_#000] rounded-none p-4 flex flex-col gap-2 w-full max-w-xs sm:max-w-xs">
      <div className="flex items-center gap-2 mb-1">
        <img src={review.user.images.jpg.image_url} alt={review.user.username} className="w-10 h-10 rounded-full border-2 border-black" />
        <span className="font-bold text-black">{review.user.username}</span>
      </div>
      <div className="text-black font-semibold text-sm">
        {isLong ? review.review.slice(0, maxLength) + "..." : review.review}
        {isLong && (
          <button
            className="ml-2 text-blue-700 underline font-bold hover:text-pink-600"
            onClick={onShowMore}
          >
            Selengkapnya
          </button>
        )}
      </div>
      <div className="text-xs text-gray-600 mt-2">Score: <span className="font-bold text-black">{review.score}</span></div>
    </div>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [anime, setAnime] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fullReviewIdx, setFullReviewIdx] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setAnime(null);
    setReviews([]);
    setFullReviewIdx(null);
    try {
      const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.data && data.data.length > 0) {
        const animeData = data.data[0];
        setAnime(animeData);
        // Fetch reviews
        const reviewRes = await fetch(`https://api.jikan.moe/v4/anime/${animeData.mal_id}/reviews?limit=3`);
        const reviewData = await reviewRes.json();
        setReviews(reviewData.data ? reviewData.data.slice(0, 3) : []);
      } else {
        setError("Anime tidak ditemukan.");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat mengambil data.");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-yellow-100 text-black p-2 sm:p-4">
      <h1 className="text-3xl sm:text-5xl font-extrabold mb-6 sm:mb-10 tracking-tight border-4 border-black px-4 sm:px-8 py-2 sm:py-4 bg-white shadow-[8px_8px_0_0_#000] rounded-none text-center w-full max-w-2xl">Anime Search</h1>
      <form onSubmit={handleSearch} className="mb-6 sm:mb-10 flex flex-col sm:flex-row gap-2 sm:gap-3 w-full max-w-xl">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Masukkan judul anime..."
          className="p-2 sm:p-4 rounded-none text-black w-full border-4 border-black bg-yellow-50 font-bold shadow-[4px_4px_0_0_#000] focus:outline-none focus:bg-white focus:border-blue-600 transition text-sm sm:text-base"
          required
        />
        <button type="submit" className="bg-pink-500 border-4 border-black px-4 sm:px-8 py-2 sm:py-4 rounded-none font-extrabold text-black shadow-[4px_4px_0_0_#000] hover:bg-pink-400 hover:shadow-[2px_2px_0_0_#000] active:shadow-none transition-all duration-150 text-sm sm:text-base">Cari</button>
      </form>
      {loading && <p className="text-blue-700 font-extrabold animate-pulse">Mencari...</p>}
      {error && <p className="text-red-600 font-extrabold mb-4 border-2 border-black bg-white px-2 sm:px-4 py-2 shadow-[2px_2px_0_0_#000]">{error}</p>}
      {anime && (
        <>
          <div className="bg-white p-4 sm:p-8 rounded-none shadow-[8px_8px_0_0_#000] flex flex-col items-center max-w-xs sm:max-w-2xl border-4 border-black transition-all duration-300 mb-6 sm:mb-8 w-full">
            <img src={anime.images.jpg.large_image_url} alt={anime.title} className="w-40 h-52 sm:w-64 sm:h-80 object-cover rounded-none mb-4 sm:mb-6 shadow-[4px_4px_0_0_#000] border-4 border-black" />
            <h2 className="text-xl sm:text-3xl font-extrabold mb-2 text-blue-700 text-center border-b-4 border-black pb-2 w-full">{anime.title}</h2>
            {/* Indikator Recommender */}
            {typeof anime.score === "number" && (
              <div className={
                `mb-2 px-3 py-1 rounded-full font-bold text-xs sm:text-sm border-2 ` +
                (anime.score >= 7.5
                  ? "bg-green-200 border-green-600 text-green-900"
                  : "bg-red-200 border-red-600 text-red-900")
              }>
                {anime.score >= 7.5 ? "Rekomendasi" : "Tidak Rekomendasi"}
              </div>
            )}
            <p className="mb-2 sm:mb-4 text-black text-center max-h-24 sm:max-h-40 overflow-y-auto font-semibold border-2 border-black bg-yellow-50 px-2 sm:px-4 py-2 shadow-[2px_2px_0_0_#000] text-xs sm:text-base">
              {anime.synopsis || "Sinopsis tidak tersedia."}
            </p>
            <p className="font-extrabold text-base sm:text-lg text-pink-600 border-2 border-black bg-yellow-100 px-2 sm:px-4 py-2 shadow-[2px_2px_0_0_#000]">Rating: <span className="text-black">{anime.score || "-"}</span></p>
          </div>
          {reviews.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-stretch justify-center w-full max-w-xs sm:max-w-4xl mb-6 sm:mb-8">
              {fullReviewIdx === null
                ? reviews.map((review, idx) => (
                    <ReviewCard
                      key={review.mal_id + review.user.username}
                      review={review}
                      isFull={false}
                      onShowMore={() => setFullReviewIdx(idx)}
                    />
                  ))
                : (
                    <ReviewCard
                      key={reviews[fullReviewIdx].mal_id + reviews[fullReviewIdx].user.username}
                      review={reviews[fullReviewIdx]}
                      isFull={true}
                      onBack={() => setFullReviewIdx(null)}
                    />
                  )}
            </div>
          )}
        </>
      )}
    </main>
  );
}
