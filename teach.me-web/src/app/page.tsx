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
import 'aos/dist/aos.css'; // Import AOS styles

export default function Home() {
  const router = useRouter()
  const [imageUrl, setImageUrl] = useState('')
  const [fileName, setFileName] = useState('')
  const [fileError, setFileError] = useState('')

  // Initialize AOS when the component mounts
  useEffect(() => {
    AOS.init({ duration: 1000 }) // Adjust duration if needed
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
          router.push(`/${uniqueId}`)

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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-b from-zinc-100 to-white font-[family-name:var(--font-geist-sans)]">
      <header className="text-center mb-12" data-aos="fade-down">
        <Image
          src="/TeachMe-logo.png"
          alt="TeachMe"
          width={300}
          height={80}
          className="mx-auto mb-6"
        />
        <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
          TeachMe is for when your professor doesn't upload the lectures.
        </p>
      </header>
      <main className="w-full max-w-md" data-aos="fade-up">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Upload Content</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="file" className="w-full">
              <TabsContent value="file">
                <div className="space-y-4">
                  <Label htmlFor="file-upload" className="block">Upload PDF</Label>
                  <div className="flex items-center justify-center w-full">
                    <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-zinc-50 hover:bg-zinc-100" data-aos="zoom-in">
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
      </main>
    </div>
  )
}