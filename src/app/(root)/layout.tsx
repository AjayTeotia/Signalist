import { Header } from "@/components/header";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen text-gray-400">
      {/* header */}
      <Header />

      <div className="container py-10">{children}</div>
    </main>
  );
}
