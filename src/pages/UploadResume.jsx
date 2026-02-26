import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ✅ Define Base URL Once */
const BASE_URL = "http://localhost:5000";

function UploadResume() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  /* ✅ Generate Question Function */
  async function generateQuestion(skills) {
    const res = await fetch(`${BASE_URL}/api/interview/generate-question`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skills }),
    });

    return await res.json();
  }

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setUploading(true);

      /* ✅ STEP 1 — Extract Skills */
      const response = await fetch(
        `${BASE_URL}/api/resume/extract-skills`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      console.log("Extracted Skills:", data);

      if (!response.ok) {
        alert("Failed to extract skills");
        return;
      }

      /* ✅ STEP 2 — Generate Question */
      const questionData = await generateQuestion(data.skills);

      console.log("Generated Question:", questionData);

      /* ✅ STEP 3 — CREATE SESSION ID */
      const sessionId = Date.now().toString();

      /* ✅ STEP 4 — Navigate to Interview Page */
      navigate("/interview", {
        state: {
          question: questionData.question,
          sessionId: sessionId,
          skills: data.skills,
        },
      });

    } catch (error) {
      console.error("Error:", error);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Upload Your Resume</h2>
        <p style={styles.subtitle}>
          Upload your resume to begin your AI-powered interview.
        </p>

        <input
          type="file"
          id="fileUpload"
          style={{ display: "none" }}
          onChange={(e) => setFile(e.target.files[0])}
        />

        <label htmlFor="fileUpload" style={styles.chooseButton}>
          {file ? file.name : "Choose File"}
        </label>

        <button
          onClick={handleUpload}
          disabled={uploading}
          style={{
            ...styles.uploadButton,
            opacity: uploading ? 0.7 : 1,
          }}
        >
          {uploading ? "Processing..." : "Upload & Start Interview"}
        </button>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */
const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #d618c6, #2a5298)",
  },
  card: {
    backgroundColor: "white",
    padding: "50px",
    borderRadius: "12px",
    width: "400px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },
  title: {
    marginBottom: "10px",
    color: "#333",
  },
  subtitle: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "30px",
  },
  chooseButton: {
    display: "block",
    backgroundColor: "#17d073",
    color: "white",
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "20px",
    fontWeight: "500",
  },
  uploadButton: {
    width: "100%",
    backgroundColor: "#1976d2",
    color: "white",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default UploadResume;