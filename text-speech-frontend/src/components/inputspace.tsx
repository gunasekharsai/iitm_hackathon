import React, { useState } from "react";

const InputSpace: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize audio context
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

  // Load audio function
  async function loadAudio(audioData: ArrayBuffer) {
    try {
      const buffer = await audioContext.decodeAudioData(audioData);
      return buffer;
    } catch (error) {
      console.error('Error decoding audio data:', error);
      throw error;
    }
  }

  // Play audio function
  function playAudio(buffer: AudioBuffer) {
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
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

      const response = await fetch("https://api.sarvam.ai/text-to-speech", options);
      const jsonData = await response.json();

      if (response.ok && jsonData.audio) {
        // Decode base64 audio data
        console.log("1")
        const audioData = atob(jsonData.audio);
        console.log("2")
        const arrayBuffer = new ArrayBuffer(audioData.length);
        console.log("3")
        const uintArray = new Uint8Array(arrayBuffer);
        console.log("4")
        for (let i = 0; i < audioData.length; i++) {
          uintArray[i] = audioData.charCodeAt(i);
        }
        console.log("5")

        // Load and set the audio buffer
        const buffer = await loadAudio(arrayBuffer);
        
        console.log("6")
        setAudioBuffer(buffer);
      } else {
        setError(jsonData.error || "An error occurred");
      }
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

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {audioBuffer && (
        <button onClick={() => playAudio(audioBuffer)}>Play Audio</button>
      )}
    </div>
  );
};

export default InputSpace;
