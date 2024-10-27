'use client'

import { useEffect, useState } from 'react'
import { database } from '../../firebase/firebaseConfig'
import { ref, get } from 'firebase/database'
import { useParams } from 'next/navigation'
import Image from "next/image"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Play, Pause, SkipBack, SkipForward } from "lucide-react"

interface FileData {
  url: string
}

// API configuration
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

  const startTranscription = async (data: any) => {
    setLoadTran(true);
    setError('');
    setTranscript('');
    try {
      const send = { pdf: data };
      const response = await fetch(`${API_BASE_URL}/get_transcript`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .catch(error => console.error('Error fetching data:', error));

      if (response.status == true) {
        setTranscript(response.message);
        setLoadTran(false);
      }
      else {
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
          setFileData(data)
        } else {
          console.error('No file found for this ID.')
        }
        startTranscription(data)
        setLoading(false)
      }
    }

    fetchFileData()

  }, [id])

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
    // Here you would typically start or pause the actual audio playback
  }

  const handleProgressChange = (newValue: number[]) => {
    setProgress(newValue[0])
    // Here you would typically seek the audio to the new position
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-zinc-100 to-white font-[family-name:var(--font-geist-sans)]">
      <header className="py-4 bg-white shadow-sm">
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
          <Card className="lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle>Video Content</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="w-full aspect-video rounded-md" />
              ) : (
                <AspectRatio ratio={16 / 9}>
                  <video
                    src={fileData?.url || "/path/to/your-video.mp4"}
                    controls
                    className="rounded-md object-cover w-full h-full"
                  >
                    Your browser does not support the video tag.
                  </video>
                </AspectRatio>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-1 flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle>Transcript Generator</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              {loading ? (
                <Skeleton className="w-full h-full" />
              ) : (
                <>
                  <div className="bg-zinc-100 p-3 rounded-md mb-4 flex items-center space-x-2">
                    <Button onClick={togglePlayPause} variant="ghost" size="sm" className="p-1">
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Slider
                      value={[progress]}
                      max={100}
                      step={1}
                      onValueChange={handleProgressChange}
                      className="flex-grow"
                    />
                    <div className="text-xs text-zinc-500 w-16 text-right">
                      {Math.floor(progress / 60)}:{(progress % 60).toString().padStart(2, '0')} / 10:00
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-md border flex-grow overflow-y-auto">
                    {/* <p className="text-zinc-600">
                      Transcript will appear here as the audio plays. The content will be automatically generated and displayed in real-time.
                    </p> */}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="py-4 bg-zinc-100">
        <div className="container mx-auto px-4 text-center text-zinc-600 text-sm">
          <p>&copy; 2024 TeachMe. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}