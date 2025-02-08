import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Background from "./components/main/main-background";
import MainHeader from "./components/main/main-header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Pasjans",
  description: "Projekt pasjans 20436 20453 20475",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MainHeader />
        <div className="bg-blue-100 w-screen">
          <div className="p-40 pt-10 bg-indigo-200 rounded-full">
            {children}
          </div>
        </div>
        
      </body>
    </html>
  );
}
