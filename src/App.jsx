import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import {SignIn, SignUp} from "./pages/AuthenticationPages";
import ReservationPage from "./pages/ReservationPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/reserve" element={<ReservationPage />} />
        <Route path="/dashboard" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
