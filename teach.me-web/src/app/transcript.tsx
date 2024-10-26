'use client'; // This line defines the component as a Client Component

import React, { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { SYSTEM_ENTRYPOINTS } from 'next/dist/shared/lib/constants';

// API configuration
const API_BASE_URL = 'http://localhost:5000';

const TranscriptGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');

  const startTranscription = async () => {
    setLoading(true);
    setError('');
    setTranscript('');

    // useEffect(() => {
    //   fetch(`${API_BASE_URL}/get_transcript`)
    //     .then(response => response.json())
    //     .then(data => setData(data))
    //     .catch(error => console.error('Error fetching data:', error));
    // }, []);

    try {
      const response = await fetch(`${API_BASE_URL}/get_transcript`)
        .then(response => response.json())
        .catch(error => console.error('Error fetching data:', error));

      // if (!response.ok) {
      //   throw new Error('Failed to start transcription');
      // }

      // Start polling for transcript status
      // pollInterval.current = setInterval(checkTranscriptStatus, 2000); // Poll every 2 seconds

      // console.log("data: ", response.message);

      if (response.status == true) {
        setTranscript(response.message);
        setLoading(false);
      }
      else {
        throw new Error('Failed to get transcript');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }


  };

  return (
    <div className="container mx-auto p-4 text-lg h-max">
      <div >
        Transcript Generator
      </div>
      <div className="">
        <button
          onClick={startTranscription}
          disabled={loading}
          className="w-full bg-white text-black"
        >
          {loading ? (
            <>
              Generating Transcript...
            </>
          ) : (
            'Generate Transcript'
          )}
        </button>

        {error && (
          <div>
            Alert Failed to Fetch Transcript
          </div>
        )}

        {transcript ? (
          <div>
            <h3 className="text-lg font-semibold mb-2 text-white">Generated Transcript:</h3>
            <div className="mt-4 w-full h-72 bg-black text-white 
          border border-white/30
          shadow-[0_0_15px_rgba(255,255,255,0.1)]
          placeholder-gray-400 resize-none rounded-sm overflow-y-auto">

              <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap relative text-left">
                {transcript}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-4 w-full h-72 bg-black text-white 
          border border-white/30 rounded-sm
          shadow-[0_0_15px_rgba(255,255,255,0.1)]
          placeholder-gray-400 
          flex justify-center items-center
          ">
              {loading && (
                <Loader2 className="mr-2 h-20 w-20 animate-spin" />
              )
              }

            </div>
          </>

        )}
      </div>
    </div>
  );
};

export default TranscriptGenerator;