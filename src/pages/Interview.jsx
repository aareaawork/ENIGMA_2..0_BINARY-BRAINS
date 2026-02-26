import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Editor from "@monaco-editor/react";

const BASE_URL = "http://localhost:5000";

/* ---------------- TIMER COMPONENT ---------------- */
function Timer({ onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(1800);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeUp]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return <h4>⏳ Time Left: {formatTime(timeLeft)}</h4>;
}

/* ---------------- MAIN INTERVIEW COMPONENT ---------------- */
function Interview() {
  const location = useLocation();

  const initialQuestion = location.state?.question || "No question received.";
  const sessionId = location.state?.sessionId;
  const skills = location.state?.skills || [];

  const [question, setQuestion] = useState(initialQuestion);
  const [followUpCount, setFollowUpCount] = useState(0);

  const [code, setCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const [output, setOutput] = useState("");
  const [remarks, setRemarks] = useState("");
  const [activeTab, setActiveTab] = useState("output");
  const [submitted, setSubmitted] = useState(false);
  const [listening, setListening] = useState(false);

  const [technicalScore, setTechnicalScore] = useState(null);
  const [reasoningScore, setReasoningScore] = useState(null);
  const [feedback, setFeedback] = useState("");

  const recognitionRef = useRef(null);

  /* ---------------- SPEECH RECOGNITION ---------------- */
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-IN";

    recognition.onresult = (event) => {
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + " ";
        }
      }

      if (finalTranscript) {
        setExplanation((prev) => prev + finalTranscript);
      }
    };

    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Use Google Chrome for speech recognition.");
      return;
    }

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  /* -------- RUN CODE -------- */
  const handleRun = () => {
    try {
      const result = new Function(code)();
      setOutput(String(result));
      setRemarks("✅ Code executed successfully.");
    } catch (err) {
      setOutput("❌ Error in code");
      setRemarks(`⚠️ ${err.message}`);
    }
  };

  /* -------- ANALYZE ANSWER -------- */
  const analyzeAnswer = async () => {
    const res = await fetch(`${BASE_URL}/api/interview/analyze-answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId,
        skills: skills,
        transcript: explanation,
        code: code,
      }),
    });

    const data = await res.json();

    setTechnicalScore(data.technical_score);
    setReasoningScore(data.reasoning_score);
    setFeedback(data.feedback);
  };

  /* -------- FOLLOW-UP QUESTION -------- */
  const getFollowUp = async () => {
    const res = await fetch(`${BASE_URL}/api/interview/follow-up`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transcript: explanation,
        code: code,
      }),
    });

    const data = await res.json();

    if (data.follow_up_question) {
      setQuestion(data.follow_up_question);
      setFollowUpCount((prev) => prev + 1);

      // Reset for next answer
      setCode("");
      setExplanation("");
      setOutput("");
      setSubmitted(false);
      setTechnicalScore(null);
      setReasoningScore(null);
      setFeedback("");
      setRemarks("🔁 Follow-up question generated.");
    }
  };

  /* -------- SUBMIT -------- */
  const handleSubmit = async () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setListening(false);
    setSubmitted(true);

    await analyzeAnswer();
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "30% 70%",
        height: "100vh",
        backgroundColor: "#1e1e1e",
        color: "white",
      }}
    >
      {/* LEFT PANEL */}
      <div style={{ padding: "20px", borderRight: "1px solid gray" }}>
        <h3>
          {followUpCount === 0
            ? "Question"
            : `Follow-Up Question ${followUpCount}`}
        </h3>

        <p>{question}</p>

        <Timer onTimeUp={() => setSubmitted(true)} />

        <h4>Your Approach</h4>

        <textarea
          rows="6"
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "6px",
            backgroundColor: "#2c2c2c",
            color: "white",
            marginBottom: "10px",
          }}
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          disabled={submitted}
        />

        <button onClick={toggleListening} disabled={submitted}>
          {listening ? "🛑 Stop Listening" : "🎤 Start Speaking"}
        </button>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ padding: "20px" }}>
        <h3>Code Editor</h3>

        <Editor
          height="50vh"
          language="javascript"
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value)}
          options={{ minimap: { enabled: false }, readOnly: submitted }}
        />

        <br />

        <button onClick={handleRun} disabled={submitted}>
          Run Code
        </button>

        <button
          onClick={handleSubmit}
          disabled={!code || !explanation || submitted}
          style={{ marginLeft: "10px" }}
        >
          Submit
        </button>

        {submitted && (
          <button
            onClick={getFollowUp}
            style={{
              marginLeft: "10px",
              backgroundColor: "#ff9800",
              color: "white",
            }}
          >
            Next Follow-Up →
          </button>
        )}

        <hr />

        <h4>Output</h4>
        <pre>{output}</pre>

        {technicalScore !== null && (
          <>
            <hr />
            <p>📊 Technical Score: {technicalScore}</p>
            <p>🧠 Reasoning Score: {reasoningScore}</p>
            <p>💬 Feedback: {feedback}</p>
          </>
        )}

        <p>{remarks}</p>
      </div>
    </div>
  );
}

export default Interview;