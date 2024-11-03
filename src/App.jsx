import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/landing" element={<LandingPage />} />
            </Routes>
        </Router>
    );
}

export default App;
