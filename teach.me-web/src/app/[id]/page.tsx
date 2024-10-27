'use client'

import { useEffect, useState, useRef } from 'react'
import { database } from '../../firebase/firebaseConfig'
import { ref, get } from 'firebase/database'
import { useParams } from 'next/navigation'
import Image from "next/image"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Play, Pause } from "lucide-react"
import AOS from 'aos';
import 'aos/dist/aos.css';

interface FileData {
  url: string
  audioUrl: string
}

const API_BASE_URL = 'http://127.0.0.1:5000/';

export default function FilePage() {
  const { id } = useParams()
  const [fileData, setFileData] = useState<FileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [loadTran, setLoadTran] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startTranscription = async (data: any) => {
    setLoadTran(true);
    setError('');
    setTranscript('');
    try {
      const response = await fetch(`${API_BASE_URL}/get_transcript`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      const json = await response.json();

      if (json.status) {
        setTranscript(json.message);
        setLoadTran(false);
      } else {
        throw new Error('Failed to get transcript');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoadTran(false);
    }
  };

  useEffect(() => {
    const fetchFileData = async () => {
      if (id) {
        const fileRef = ref(database, `uploads/${id}`)
        const snapshot = await get(fileRef)
        const data = snapshot.val()

        if (data) {
          setFileData(data);
          try {
            await fetch(`${API_BASE_URL}/store_id`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ id })
            });
          } catch (error) {
            console.error('Error storing ID:', error);
          }
        } else {
          console.error('No file found for this ID.');
        }
        startTranscription(data);
        setLoading(false);
      }
    }

    fetchFileData()

    // Initialize AOS animations
    AOS.init({
      duration: 1250,
      easing: 'ease-in-out',
    });
  }, [id]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  }

  const handleProgressChange = (newValue: number[]) => {
    setProgress(newValue[0]);
    if (audioRef.current) {
      audioRef.current.currentTime = newValue[0];
    }
  }

  const updateProgress = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-black font-[family-name:var(--font-geist-sans)]">
      <header className="py-4 bg-black shadow-sm">
        <div className="container mx-auto px-4">
          <Image
            src="/TeachMe-logo.png"
            alt="TeachMe"
            width={150}
            height={40}
            className="mx-auto"
          />
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Video Content Card */}
          <Card className="lg:col-span-1 bg-black text-zinc-200" data-aos="fade-right">
            <CardHeader className="pb-2">
              <CardTitle>Video Content</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="w-full aspect-video rounded-md" />
              ) : (
                <AspectRatio ratio={16 / 9}>
                  <video
                    src="/cat.mp4"
                    controls
                    className="rounded-md object-cover w-full h-full"
                  >
                    Your browser does not support the video tag.
                  </video>
                </AspectRatio>
              )}
            </CardContent>
          </Card>

          {/* Transcript Card */}
          <Card className="lg:col-span-1 flex flex-col bg-black text-zinc-200" data-aos="fade-left">
            <CardHeader className="pb-2">
              <CardTitle>Transcript Generator</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              <div className="bg-black p-3 rounded-md mb-4 flex items-center space-x-2">
                <Button onClick={togglePlayPause} variant="ghost" size="sm" className="p-1 text-zinc-200">
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Slider
                  value={[progress]}
                  max={600}
                  step={1}
                  onValueChange={handleProgressChange}
                  className="flex-grow"
                />
                <div className="text-xs text-zinc-500 w-16 text-right">
                  {Math.floor(progress / 60)}:{(progress % 60).toString().padStart(2, '0')} / 10:00
                </div>
              </div>
              <div className="bg-black p-4 rounded-md border flex-grow overflow-y-auto text-zinc-200">
                {loadTran ? (
                  <div className="flex flex-col space-y-2">
                    <Skeleton className="h-4 w-full flashing-skeleton" />
                    <Skeleton className="h-4 w-full flashing-skeleton" />
                    <Skeleton className="h-4 w-full flashing-skeleton" />
                    <Skeleton className="h-4 w-full flashing-skeleton" />
                    <Skeleton className="h-4 w-full flashing-skeleton" />
                    <Skeleton className="h-4 w-full flashing-skeleton" />
                  </div>
                ) : (
                  transcript || "No transcript available."
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <audio
          ref={audioRef}
          src="/lecture.mp3"
          onTimeUpdate={updateProgress}
          preload="auto"
        />

        <div 
          className="lg:col-span-1 flex flex-col mt-4 h-60"
          data-aos="fade-up"
        >
          {/* Additional Information Card */}
          <Card className="bg-black text-zinc-200">
            <CardHeader className="pb-2">
              <CardTitle>Extra Information for Guidance</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              {loading ? (
                <Skeleton className="w-full h-full" />
              ) : (
                <div className="bg-black p-4 rounded-md border flex-grow overflow-y-auto h-full text-zinc-200">
                  {/* Additional content goes here */}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="py-4 bg-black text-zinc-600 text-center text-sm">
        &copy; 2024 TeachMe. All rights reserved.
      </footer>

      <style jsx>{`
        @keyframes flash {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        .flashing-skeleton {
          animation: flash 1s infinite;
        }
      `}</style>
    </div>
  )
}
