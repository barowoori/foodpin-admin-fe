import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
import KakaoCallbackPage from "./pages/KakaoCallbackPage";
import LoginPage from "./pages/LoginPage";
import ApprovalDashboardPage from "./pages/ApprovalDashboardPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<KakaoCallbackPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="dashboard" element={<ApprovalDashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
