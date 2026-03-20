import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import "./App.css";
import {
  ApprovalDashboardPage,
  EventManagementPage,
  KakaoCallbackPage,
  LoginPage,
} from "./pages";
import EventFormPage from "./pages/EventFormPage";
import { scrollToTop } from "./utils";

function ScrollToTopOnRouteChange() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    scrollToTop();
  }, [pathname, search]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTopOnRouteChange />
      <Routes>
        <Route path="/" element={<KakaoCallbackPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="business" element={<ApprovalDashboardPage />} />
        <Route path="events" element={<EventManagementPage />} />
        <Route path="events/form" element={<EventFormPage />} />
        <Route path="events/form/:eventId" element={<EventFormPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
