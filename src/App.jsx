import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/landing" />} />
                <Route path="/landing" element={<LandingPage />} />
            </Routes>
        </Router>
    );
}

export default App;
