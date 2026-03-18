import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
import {
  ApprovalDashboardPage,
  EventManagementPage,
  KakaoCallbackPage,
  LoginPage,
} from "./pages";

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
