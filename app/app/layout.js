import "./globals.css";

export const metadata = {
  title: "Search Anime",
  description: "cari anime favoritmu disini",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
