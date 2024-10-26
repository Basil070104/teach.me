import Image from "next/image";
import { Input } from "../components/ui/input";
import { InputFile } from "../components/ui/fileInput";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col items-center justify-center gap-8">
        <Image src="/logo.svg" alt="Teach.me" width={128} height={128} />
        <h1 className="text-4xl font-bold text-zinc-950">TeachMe</h1>
        <p className="text-lg text-zinc-500">
          TeachMe is a platform for learning and online. Use if you skipped your lectures.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center gap-8">
        <div className="flex flex-col items-center justify-center gap-4">
          <h2 className="text-2xl font-bold text-zinc-950">PDF</h2>
          <p className="text-lg text-zinc-500">
            Input a file.
          </p>
          <InputFile />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-zinc-950">Get Started</h2>
        <p className="text-lg text-zinc-500">
          Get started with TeachMe.
        </p>
        {/* HAHAHAHAHAHHA */}

      </div>
    </div>
  );
}