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

      console.log("data: ", response.message);
      //   if (data.status === 'success') {
      //     setTranscript(data.text);
      //   } else {
      //     throw new Error(data.message || 'Failed to get transcript');
      //   }

      setTranscript(response.message);
      setLoading(false);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }


  };

  return (
    <div className="container mx-auto p-4 max-w-4xl text-lg">
      <div>
        Transcript Generator
      </div>
      <div className="space-y-4">
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <>
          </>
        )
        }
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

        {transcript && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2 text-white">Generated Transcript:</h3>
            <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap">
              {transcript}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranscriptGenerator;