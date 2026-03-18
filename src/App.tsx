import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
import {
  ApprovalDashboardPage,
  EventManagementPage,
  KakaoCallbackPage,
  LoginPage,
} from "./pages";
import EventFormPage from "./pages/EventFormPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<KakaoCallbackPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="business" element={<ApprovalDashboardPage />} />
        <Route path="events" element={<EventManagementPage />} />
        <Route path="events/form" element={<EventFormPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
