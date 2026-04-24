import KakakoImg from "../assets/kakako.png";
import LoginImg from "../assets/loginImg.png";
import { getKakaoLoginUrl } from "../apis";

function LoginPage() {
  const handleKakaoLogin = () => {
    const loginUrl = getKakaoLoginUrl();
    window.location.href = loginUrl;
  };

  return (
    <div className="bg-bg-app flex min-h-dvh items-center justify-center px-6">
      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        <img src={LoginImg} alt="logo" className="w-45" />
        <button
          type="button"
          onClick={handleKakaoLogin}
          className="font-pretendard tracking-brand leading-brand bg-brand-kakao flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg text-sm font-semibold"
        >
          <img src={KakakoImg} alt="kakao" className="w-4" />
          <span>카카오로 로그인</span>
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
