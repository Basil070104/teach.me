import Image from "next/image";
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import TranscriptGenerator from "./transcript";

export default function Home() {
  return (
    <div className="min-w-screen min-h-screen items-center justify-items-center font-[family-name:var(--font-geist-sans)]">
      <main className="items-center w-full h-3/4">
        <TranscriptGenerator>

        </TranscriptGenerator>
      </main>
    </div>
  );
}
