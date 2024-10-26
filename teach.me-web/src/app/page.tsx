import Image from "next/image";
import { Input } from "../components/ui/input";
import { InputFile } from "../components/ui/fileInput"; // Add this import for the InputFile component

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col items-center justify-center gap-8">
        <Image src="/logo.svg" alt="Teach.me" width={128} height={128} />
        <h1 className="text-4xl font-bold text-zinc-950">Welcome to TeachMe</h1>
        <p className="text-lg text-zinc-500">
          Teach.me is a platform for learning and teaching. It is a place where
          you can learn from the best and teach the best.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div className="flex flex-col items-center justify-center gap-4">
          <h2 className="text-2xl font-bold text-zinc-950">Sign Up</h2>
          <p className="text-lg text-zinc-500">
            Sign up to get started with Teach.me. It is free and easy to get
            started.
          </p>
          <button className="w-full h-12 px-4 text-lg font-bold text-white bg-blue-500 rounded-md">
            Sign Up
          </button>
        </div>
        <div className="flex flex-col items-center justify-center gap-4">
          <h2 className="text-2xl font-bold text-zinc-950">Sign In</h2>
          <p className="text-lg text-zinc-500">
            Sign in to your account to access your courses and start learning.
          </p>
          <Input type="submit" value="Sign In" className="w-full h-12 px-4 text-lg font-bold text-white bg-blue-500 rounded-md" />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-zinc-950">Get Started</h2>
        <p className="text-lg text-zinc-500">
          Get started with Teach.me by signing up or signing in to your account.
        </p>
        {/* Add the InputFile component here */}
        <InputFile />
      </div>
    </div>
  );
}