"use client";

import { Toaster } from "@/components/ui/toaster";
import { Upload } from "@/components/Upload";
import { ImagesList } from "@/components/Images";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Upload />
      <ImagesList />
      <Toaster />
    </main>
  );
}
