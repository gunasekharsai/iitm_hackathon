import React, { useState, useEffect } from 'react';

interface AudioPlayerProps {
  base64Data?: string;
  className?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ base64Data, className }) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (base64Data) {
      try {
        // Convert base64 to binary
        const binaryString = atob(base64Data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        // Create blob and URL
        const blob = new Blob([bytes], { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        // Cleanup
        return () => {
          if (url) URL.revokeObjectURL(url);
        };
      } catch (err) {
        setError('Error processing audio data');
        console.error('Error:', err);
      }
    }
  }, [base64Data]);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className={className}>
      {audioUrl ? (
        <div className="space-y-4">
          <audio 
            controls 
            src={audioUrl}
            className="w-full"
          >
            Your browser does not support the audio element.
          </audio>
          <a
            href={audioUrl}
            download="audio.wav"
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Download WAV
          </a>
        </div>
      ) : (
        <div>No audio available</div>
      )}
    </div>
  );
};


export default AudioPlayer