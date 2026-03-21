import { useNavigate } from "react-router";

function UnauthorizedAccessPage() {
  const navigate = useNavigate();

  const handleMoveToLogin = () => {
    navigate("/login", { replace: true });
  };

  return (
    <div className="bg-bg-app font-pretendard flex min-h-dvh items-center justify-center px-6">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-sm">
        <h1 className="text-fg-primary text-xl font-semibold">접근 권한이 없습니다</h1>
        <p className="text-fg-secondary mt-3 text-sm leading-6">
          현재 계정은 관리자 권한이 없어 서비스에 접근할 수 없습니다.
          <br />
          권한이 필요하면 관리자에게 문의해주세요.
        </p>
        <button
          type="button"
          onClick={handleMoveToLogin}
          className="bg-fg-primary text-bg-app mt-6 w-full rounded-lg px-4 py-3 text-sm font-semibold"
        >
          로그인 화면으로 이동
        </button>
      </div>
    </div>
  );
}

export default UnauthorizedAccessPage;
