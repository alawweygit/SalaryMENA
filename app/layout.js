import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Gate from "./components/Gate";
import { LanguageProvider } from "./components/LanguageContext";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "SalaryMENA — Know Your Worth",
  description: "The first anonymous salary platform built for the MENA region. Real salaries, 100% anonymous, built for UAE, Saudi Arabia, Egypt, Oman and all MENA countries.",
  keywords: "salary, MENA, UAE, Saudi Arabia, Egypt, Oman, Kuwait, Qatar, salary transparency, how much do people earn, am I underpaid",
  openGraph: {
    title: "SalaryMENA — Know Your Worth",
    description: "The first anonymous salary platform built for the MENA region. Real salaries, 100% anonymous.",
    url: "https://salarymena.com",
    siteName: "SalaryMENA",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SalaryMENA — Know Your Worth",
    description: "The first anonymous salary platform built for the MENA region.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="N7kvCCw4xOv9uGlPHNBC834wXUw7n9G8QjKanPixDY8" />
        <link rel="icon" href="/favicon-v2.ico?v=2" />
        <link rel="shortcut icon" href="/favicon-v2.ico?v=2" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <LanguageProvider>
          <Gate>
            {children}
          </Gate>
        </LanguageProvider>
      </body>
    </html>
  );
}