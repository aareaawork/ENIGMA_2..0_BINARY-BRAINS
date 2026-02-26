import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UploadResume from "./pages/UploadResume";
import Interview from "./pages/Interview";
import Report from "./pages/Report";
import Analytics from "./pages/Analytics";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadResume />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/report" element={<Report />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Router>
  );
}

export default App;