import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
import KakaoCallbackPage from "./pages/KakaoCallbackPage";
import LoginPage from "./pages/LoginPage";
import ApprovalDashboardPage from "./pages/ApprovalDashboardPage";
import EventManagementPage from "./pages/EventManagementPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<KakaoCallbackPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="business" element={<ApprovalDashboardPage />} />
        <Route path="events" element={<EventManagementPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
