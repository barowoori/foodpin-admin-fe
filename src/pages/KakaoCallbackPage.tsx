import { useEffect } from "react";
import { useNavigate } from "react-router";
import { loginWithKakaoCode } from "../apis/auth";
import { useAuthStore } from "../stores/authStore";

function KakaoCallbackPage() {
  const navigate = useNavigate();
  const setTokens = useAuthStore((state) => state.setTokens);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");
    const oauthError = searchParams.get("error");

    if (oauthError || !code) {
      navigate("/login", { replace: true });
      return;
    }

    let isCancelled = false;

    const login = async () => {
      try {
        const { accessToken, refreshToken } = await loginWithKakaoCode(code);

        if (!accessToken || !refreshToken) {
          throw new Error("토큰 수신에 실패했습니다.");
        }

        if (!isCancelled) {
          setTokens(accessToken, refreshToken);

          const { accessToken: storedAccessToken, refreshToken: storedRefreshToken } =
            useAuthStore.getState();

          if (storedAccessToken && storedRefreshToken) {
            navigate("/dashboard", { replace: true });
            return;
          }

          throw new Error("토큰 저장에 실패했습니다.");
        }
      } catch {
        if (!isCancelled) {
          navigate("/login", { replace: true });
        }
      }
    };

    login();

    return () => {
      isCancelled = true;
    };
  }, [navigate, setTokens]);

  return (
    <div className="font-pretendard bg-bg-app text-fg-secondary flex min-h-dvh items-center justify-center">
      Loading...
    </div>
  );
}

export default KakaoCallbackPage;
