'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from "next/image"
import { uploadFileInfo } from '@/lib/firebaseUtils'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { AlertCircle, FileText } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import AOS from 'aos';
import 'aos/dist/aos.css';
import ParticleBackground from '@/components/ui/ParticleBackground'


export default function Home() {
  const router = useRouter()
  const [imageUrl, setImageUrl] = useState('')
  const [fileName, setFileName] = useState('')
  const [fileError, setFileError] = useState('')
  const [logoAnimated, setLogoAnimated] = useState(false)

  useEffect(() => {
    AOS.init({ duration: 1250 })
  }, [])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type === 'application/pdf') {
        setFileName(file.name)
        setFileError('')
        try {
          const uniqueId = await uploadFileInfo(file)
          console.log("File uploaded successfully!")
          // Trigger logo animation
          setLogoAnimated(true)
          // Redirect after animation
          setTimeout(() => router.push(`/${uniqueId}`), 1500) // Adjust timing as needed
        } catch (error) {
          console.error("File upload failed:", error)
          setFileError('File upload failed. Please try again.')
        }
      } else {
        setFileName('')
        setFileError('Please upload a PDF file.')
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8  font-[family-name:var(--font-geist-sans)]">
      {/* <ParticleBackground /> */}
      <header className={`text-center mb-20 ${logoAnimated ? 'animate-logo-slide' : ''}`} data-aos="fade-down">
        <Image
          src="/TeachMe-logo.png"
          alt="TeachMe"
          width={300}
          height={80}
          className={`mx-auto mb-6 ${logoAnimated ? 'shrink-logo' : ''}`}
        />
        <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
          Make education and learning more interactive with Teach Me
        </p>
      </header>
      <main className="w-full max-w-md relative" data-aos="zoom-in-up">
        {/* Wrapper div for positioning the two cards */}
        <div className="relative">
          {/* Shadow card behind */}
          <Card className="absolute inset-0 transform translate-x-0 translate-y-0 redBoxShadow" aria-hidden="true"></Card>

          {/* Main card in the foreground */}
          <Card className="bg-red relative">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Upload Content</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="file" className="w-full">
                <TabsContent value="file">
                  <div className="space-y-4">
                    <Label htmlFor="file-upload" className="block">Upload PDF</Label>
                    <div className="flex items-center justify-center w-full">
                      <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-black" data-aos="zoom-in">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <FileText className="w-10 h-10 mb-3 text-zinc-400" />
                          <p className="mb-2 text-sm text-zinc-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                          <p className="text-xs text-zinc-500">PDF files only (MAX. 10MB)</p>
                        </div>
                        <Input
                          id="file-upload"
                          type="file"
                          className="hidden"
                          onChange={handleFileUpload}
                          accept=".pdf"
                        />
                      </label>
                    </div>
                    {fileName && (
                      <p className="text-sm text-zinc-600" data-aos="fade-right">Selected file: {fileName}</p>
                    )}
                    {fileError && (
                      <Alert variant="destructive" data-aos="fade-left">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{fileError}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-zinc-500" data-aos="fade-in">TeachMe 2024 - Empowering Education</p>
            </CardFooter>
          </Card>
        </div>
      </main>

      {/* Add custom styles for animations */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(0);
            width: 300px;
            height: 80px;
          }
          to {
            transform: translateY(-100px);
            width: 150px;
            height: 40px;
          }
        }

        .animate-logo-slide {
          animation: slide-up 1.5s forwards;
        }

        .shrink-logo {
          width: 150px !important;
          height: 40px !important;
        }
      `}</style>
    </div>
  )
}