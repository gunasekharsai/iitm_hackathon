import React, { useState } from "react";
import AudioPlayer from "./Audioplayer";

const InputSpace: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [responsedata, setResponseData] = useState<null>(null)


  // initalizeing audio context to expose the audio file
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();


  // to load the audio

  async function loadAudio(audioData: ArrayBuffer) {
    try {
      const audioBuffer = await audioContext.decodeAudioData(audioData);
      return audioBuffer;
    } catch (error) {
      console.error('Error decoding audio data:', error);
      throw error;
    }
  }
  

  // to play the audio

  function playAudio(audioBuffer: AudioBuffer) {
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(0);
  }
  




  const handleSubmit = async () => {
    try {
      const options = {
        method: "POST",
        headers: {
          "api-subscription-key": "bd939900-7501-4e33-9fae-9a1cb6ec18ca",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: [text],
          target_language_code: "en-IN",
          speaker: "meera",
          pitch: 0,
          pace: 1.65,
          loudness: 1.5,
          speech_sample_rate: 8000,
          enable_preprocessing: false,
          model: "bulbul:v1",
          eng_interpolation_wt: 123,
          override_triplets: {},
        }),
      };

      setLoading(true);
      setError(null);
      console.log("before fetch")

      const response = await fetch(
        "https://api.sarvam.ai/text-to-speech",
        options
      );


      const data = await response.json();
      console.log(data);
    
      if (data.audios && data.audios.length > 0) {
        setResponseData(data);
      } else {
        throw new Error('No audio data found in response');
      }
     
    //   if (response.ok) {
    //     setAudioUrl(data.audio_file);
    //   } else {
    //     setError(data.error || "An error occurred");
    //   }
    } catch (e) {
      setError(e instanceof Error ? e.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Text-to-Speech Converter</h2>
      <input
        type="text"
        placeholder="Enter your text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={loading}
      />
      <button onClick={handleSubmit} disabled={loading || !text}>
        {loading ? "Converting..." : "Convert to Speech"}
      </button>

      {responsedata && responsedata.audios.map((audioData: string, index: number) => (
        <div key={index} className="mb-6 p-4 border rounded">
          <h3 className="font-bold mb-2">Audio {index + 1}</h3>
          <AudioPlayer base64Data={audioData} />
        </div>
      ))}

     
      
    </div>
  );
};

export default InputSpace;
