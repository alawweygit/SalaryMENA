import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Gate from "./components/Gate";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SalaryMENA — Know Your Worth",
  description: "The first anonymous salary platform built for the MENA region.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Gate>
          {children}
        </Gate>
      </body>
    </html>
  );
}
