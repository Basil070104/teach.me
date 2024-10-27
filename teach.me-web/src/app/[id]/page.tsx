'use client'

import { useEffect, useState } from 'react'
import { database } from '../../firebase/firebaseConfig'
import { ref, get } from 'firebase/database'
import { useParams } from 'next/navigation'
import Image from "next/image"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import TranscriptGenerator from '../../components/ui/transcript';

interface FileData {
  url: string
}

// API configuration
const API_BASE_URL = 'http://127.0.0.1:5000/';

export default function FilePage() {
  const { id } = useParams()
  const [fileData, setFileData] = useState<FileData | null>(null)
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="flex flex-col items-center justify-center">
        <Image
          src="/TeachMe-logo.png"
          alt="TeachMe"
          width={300}
          height={80}
        />
      </header>

      <main className="grid gap-8">
        <section className="w-full max-w-[800px] mx-auto">
          <AspectRatio ratio={16 / 9}>
            <video
              src="/path/to/your-video.mp4"
              controls
              autoPlay
              loop
              muted
              className="rounded-md object-cover w-full h-full"
            >
              Your browser does not support the video tag.
            </video>
          </AspectRatio>
        </section>

        <section className="w-full max-w-[900px] mx-auto">
          {fileData?.url ? (
            <iframe
              src={fileData.url}
              className="w-full h-[600px] border-none"
              title="PDF Viewer"
            >
              This browser does not support PDFs. Please download the PDF to view it:
              <a href={fileData.url}>Download PDF</a>
            </iframe>
          ) : (
            <p>No PDF available.</p>
          )}
        </section>

        <div>
          {/* <TranscriptGenerator /> */}
          {error && (
            <div>
              Alert Failed to Fetch Transcript
            </div>
          )}

          {transcript && (
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">Generated Transcript:</h3>
              <div className="mt-4 w-full h-72 bg-white text-black 
          border border-white/30
          shadow-[0_0_15px_rgba(255,255,255,0.1)]
          placeholder-gray-400 resize-none rounded-sm overflow-y-auto">

                <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap relative text-left">
                  {transcript}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer>
        {/* Add footer content if needed */}
      </footer>
    </div>
  )
}
