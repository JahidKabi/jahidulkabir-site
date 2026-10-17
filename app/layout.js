import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata = {
  metadataBase: new URL("https://jahidulkabir.com"),
  title: "Md Jahidul Kabir · Cloud DevOps engineer",
  description:
    "Cloud DevOps engineer building CI/CD pipelines, containerized environments, and infrastructure as code.",
};

export const viewport = { themeColor: "#0a0a0a", viewportFit: "cover" };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}