import { lazy, Suspense, useEffect, type ReactElement } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import "./App.css";
import { KakaoCallbackPage } from "./pages";
import { scrollToTop } from "./utils";

function ScrollToTopOnRouteChange() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    scrollToTop();
  }, [pathname, search]);

  return null;
}

const ApprovalDashboardPage = lazy(
  () => import("./pages/ApprovalDashboardPage"),
);
const EventManagementPage = lazy(() => import("./pages/EventManagementPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const UnauthorizedAccessPage = lazy(
  () => import("./pages/UnauthorizedAccessPage"),
);
const EventFormPage = lazy(() => import("./pages/EventFormPage"));

const withSuspense = (element: ReactElement) => (
  <Suspense fallback={null}>{element}</Suspense>
);
function App() {
  return (
    <BrowserRouter>
      <ScrollToTopOnRouteChange />
      <Routes>
        <Route path="/" element={<KakaoCallbackPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="unauthorized" element={<UnauthorizedAccessPage />} />
        <Route
          path="business"
          element={withSuspense(<ApprovalDashboardPage />)}
        />
        <Route path="events" element={withSuspense(<EventManagementPage />)} />
        <Route path="events/form" element={withSuspense(<EventFormPage />)} />
        <Route
          path="events/form/:eventId"
          element={withSuspense(<EventFormPage />)}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
