"use client";

import { useRouter } from 'next/navigation';
import Image from "next/image";
import { InputFile } from "../components/ui/fileInput";
import { uploadFileInfo } from '../lib/firebaseUtils';

export default function Home() {
  const router = useRouter();

  const handleFileUpload = async (file: File) => {
    try {
      const uniqueId = await uploadFileInfo(file); 
      console.log("File uploaded successfully!");

      router.push(`/${uniqueId}`);
    } catch (error) {
      console.error("File upload failed:", error);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* Header */}
      <div className="flex flex-col items-center justify-center gap-8">
        <Image
          src="/TeachMe-logo.png"
          alt="TeachMe"
          width={300}
          height={80}
        />
        <p className="text-lg text-zinc-500">
          TeachMe is a platform for learning and online. Use if you skipped your lectures.
        </p>
      </div>
      
      {/* File Upload */}
      <div className="flex flex-col items-center justify-center gap-8">
        <div className="flex flex-col items-center justify-center gap-4">
          <h2 className="text-2xl font-bold text-zinc-950">PDF</h2>
          <p className="text-lg text-zinc-500">Input a file.</p>
          <InputFile onChange={handleFileUpload} />
        </div>
      </div>
      
      {/* Get Started */}
      <div className="flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-zinc-950">Get Started</h2>
        <p className="text-lg text-zinc-500">TeachMe 2024</p>
      </div>
    </div>
  );
}