"use client";

import { Toaster } from "@/components/ui/toaster";
import { Upload } from "@/lib/upload/index";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Upload maxSizeInMb={10} fileTypes="image/png" />
      <Toaster />
    </main>
  );
}
