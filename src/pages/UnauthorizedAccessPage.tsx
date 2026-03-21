import { Button } from "../components";
import { useNavigate } from "react-router";

function UnauthorizedAccessPage() {
  const navigate = useNavigate();

  const handleMoveToLogin = () => {
    navigate("/login", { replace: true });
  };

  return (
    <div className="bg-bg-app font-pretendard flex min-h-dvh items-center justify-center px-4 py-4">
      <div className="border-border-control bg-bg-control w-full max-w-100 rounded-md border px-6 py-6 text-center shadow-[0_14px_30px_rgba(0,0,0,0.42)]">
        <h1 className="text-fg-primary text-[26px] font-semibold tracking-[-0.01em]">
          접근 권한이 없습니다
        </h1>

        <p className="text-fg-subtle mt-2 text-[14px] leading-7 font-medium whitespace-pre-line">
          현재 계정은 관리자 권한이 없어 서비스에 접근할 수 {"\n"}없습니다.
          권한이 필요하면 관리자에게 문의해주세요.
        </p>

        <div className="mt-5 flex justify-center">
          <Button
            onClick={handleMoveToLogin}
            className="border-focus-ring h-10 w-full max-w-72 min-w-0 bg-[#5f738a] text-[17px] font-semibold text-[#f3f6fa] hover:bg-[#6f859f] active:bg-[#556981]"
          >
            로그인 화면으로 이동
          </Button>
        </div>
      </div>
    </div>
  );
}

export default UnauthorizedAccessPage;
