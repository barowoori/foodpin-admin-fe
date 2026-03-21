import { useNavigate } from "react-router";
import { Modal } from "../shared";

function UnauthorizedAccessPage() {
  const navigate = useNavigate();

  const handleMoveToLogin = () => {
    navigate("/login", { replace: true });
  };

  return (
    <>
      <div className="bg-bg-app min-h-dvh w-full" />
      <Modal
        closeOnBackdrop={false}
        className="max-w-150 border-[#e5e7eb] bg-white px-8 py-8 text-[#2d3138]"
      >
        <div className="w-full max-w-120 text-center">
          <Modal.Header className="justify-center pt-1 pb-2 text-[30px] font-semibold tracking-[-0.01em] text-[#2d3138]">
            접근 권한이 없습니다
          </Modal.Header>
          <Modal.Description className="mt-4 text-center text-[25px] leading-6 font-medium text-[#616773]">
            현재 계정은 관리자 권한이 없어 서비스에 접근할 수 없습니다.
            {"\n"}
            권한이 필요하면 관리자에게 문의해주세요.
          </Modal.Description>
          <Modal.ButtonLayout className="mt-8 px-0 pb-0">
            <button
              type="button"
              onClick={handleMoveToLogin}
              className="w-full cursor-pointer rounded-lg bg-[#eef0f3] px-4 py-3 text-[28px] font-semibold text-[#2b313b] transition-colors hover:bg-[#e4e8ee] active:bg-[#dbe0e8]"
            >
              로그인 화면으로 이동
            </button>
          </Modal.ButtonLayout>
        </div>
      </Modal>
    </>
  );
}

export default UnauthorizedAccessPage;
