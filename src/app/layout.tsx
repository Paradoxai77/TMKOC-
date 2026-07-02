import type { Metadata } from "next";
import { Poppins, Baloo_2 } from "next/font/google";
import AppLayout from "@/components/AppLayout";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const baloo2 = Baloo_2({
  variable: "--font-baloo-2",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Gokuldham Society Quiz Platform | Ultimate TMKOC Trivia",
  description: "Play the ultimate Taarak Mehta Ka Ooltah Chashmah quiz, level up through Gokuldham Society floors, unlock power-ups, and top the leaderboard!",
  icons: {
    icon: "/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${baloo2.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-g-bg text-g-maroon font-body selection:bg-g-mustard selection:text-g-maroon flex flex-col">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
