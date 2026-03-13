import { useState } from "react";
import ApprovalStatusSelect, {
  type ApprovalStatus,
} from "../components/ApprovalStatusSelect";
import DateRangeField from "../components/DateRangeField";
import InputWrapper from "../components/InputWrapper";

function MainPage() {
  const [approvalStatus, setApprovalStatus] = useState({
    nickname: "",
    phone: "",
    approvalStatus: "APPROVED" as ApprovalStatus,
    startAt: "",
    endAt: "",
  });

  return (
    <div className="min-h-dvh bg-[#363636]">
      <div className="mx-auto w-full max-w-260 pt-30">
        <h1 className="font-pretendard tracking-brand mb-8 text-xl font-semibold text-[#fafafa]">
          사업자 등록증 승인 관리
        </h1>

        <div className="flex w-full justify-start gap-20">
          <InputWrapper>
            <InputWrapper.Label htmlFor="nickname">닉네임</InputWrapper.Label>
            <InputWrapper.Input id="nickname" type="text" />
          </InputWrapper>

          <InputWrapper>
            <InputWrapper.Label htmlFor="phone">휴대폰번호</InputWrapper.Label>
            <InputWrapper.Input id="phone" type="text" />
          </InputWrapper>

          <InputWrapper>
            <InputWrapper.Label htmlFor="approval-status">
              승인 상태
            </InputWrapper.Label>
            <ApprovalStatusSelect
              id="approval-status"
              value={approvalStatus.approvalStatus}
              onChange={(next) =>
                setApprovalStatus((prev) => ({
                  ...prev,
                  approvalStatus: next,
                }))
              }
            />
          </InputWrapper>
        </div>

        <div className="mt-12 flex w-full gap-4">
          <DateRangeField
            label="요청일"
            startId="requested-date-start"
            endId="requested-date-end"
          />
          <DateRangeField
            label="처리일"
            startId="processed-date-start"
            endId="processed-date-end"
          />
        </div>
      </div>
    </div>
  );
}

export default MainPage;
