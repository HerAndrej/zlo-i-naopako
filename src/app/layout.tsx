import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Zlo i naopako - Ljuti sosevi",
  description: "Ručno rađeni ljuti sosevi iz Srbije.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr" suppressHydrationWarning>
      <body className={`${outfit.variable} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
