import "./globals.css";

export const metadata = {
  title: "Jikan NextJS App",
  description: "Cari anime favoritmu dengan Jikan API dan Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
