"use client";

import { useEffect, useState } from 'react';
import { database } from '../../firebase/firebaseConfig';
import { ref, get } from 'firebase/database';
import { useParams } from 'next/navigation';
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio"


const FilePage = () => {
  const { id } = useParams();
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFileData = async () => {
      if (id) {
        const fileRef = ref(database, `uploads/${id}`);
        const snapshot = await get(fileRef);
        const data = snapshot.val();

        if (data) {
          setFileData(data);
        } else {
          console.error('No file found for this ID.');
        }
      }
      setLoading(false);
    };

    fetchFileData();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* Header */}
      <div className="flex flex-col items-center justify-center gap-8">
        <Image src="/logo.svg" alt="Teach.me" width={128} height={128} />
        <h1 className="text-4xl font-bold text-zinc-950">TeachMe</h1>
        <p className="text-lg text-zinc-500">
          TeachMe is a platform for learning online. Use it if you skipped your lectures.
        </p>
      </div>

 {/* Video */}
 <div className="w-full max-w-[900px] mx-auto p-4">
        <AspectRatio ratio={16 / 9}>
          <video 
            src="path/to/your-video.mp4" 
            controls 
            autoPlay 
            loop 
            muted 
            className="rounded-md object-cover w-full h-full"
            >
            Your browser does not support the video tag.
          </video>
        </AspectRatio>
      </div>

      {/* PDF Display */}
      <div className="w-full max-w-[900px] mx-auto p-4">
        {fileData?.url ? (
          <iframe 
            src={fileData.url} 
            width="100%" 
            height="600px" 
            style={{ border: "none" }} 
            title="PDF Viewer"
          >
            This browser does not support PDFs. Please download the PDF to view it: <a href={fileData.url}>Download PDF</a>
          </iframe>
        ) : (
          <p>No PDF available.</p>
        )}
      </div>

      {/* Get Started */}
      <div className="flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-zinc-950">Get Started</h2>
        <p className="text-lg text-zinc-500">Get started with TeachMe.</p>
      </div>
    </div>
  );
};

export default FilePage;
