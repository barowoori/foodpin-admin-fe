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

        if (!isCancelled) {
          setTokens(accessToken, refreshToken);
          navigate("/main", { replace: true });
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
    <div className="font-pretendard flex min-h-dvh items-center justify-center bg-[#363636] text-[#f1f1f1]">
      Loading...
    </div>
  );
}

export default KakaoCallbackPage;
