import { useState, useRef } from "react";

function VoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [error, setError] = useState("");

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    setError("");

    if (!navigator.mediaDevices || !window.MediaRecorder) {
      setError("Your browser does not support audio recording.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setError("Microphone permission denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h4>🎤 Voice Explanation</h4>

      {!isRecording ? (
        <button
          onClick={startRecording}
          style={{
            padding: "8px 15px",
            backgroundColor: "#ff9800",
            border: "none",
            color: "white",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          🎙 Start Recording
        </button>
      ) : (
        <button
          onClick={stopRecording}
          style={{
            padding: "8px 15px",
            backgroundColor: "#e53935",
            border: "none",
            color: "white",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          ⏹ Stop Recording
        </button>
      )}

      {isRecording && (
        <p style={{ color: "#ff5252", marginTop: "10px" }}>
          🔴 Recording...
        </p>
      )}

      {audioURL && (
        <div style={{ marginTop: "10px" }}>
          <audio controls src={audioURL}></audio>
        </div>
      )}

      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default VoiceRecorder;