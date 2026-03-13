import { useState } from "react";
import Button from "../components/Button";
import DateField from "../components/approve/DateField";
import SerachField from "../components/approve/SerachField";
import type {
  ApprovalFilterPatch,
  ApprovalFilterState,
} from "../types/approval";

const INITIAL_APPROVAL_FILTERS: ApprovalFilterState = {
  nickname: "",
  phone: "",
  approvalStatus: "APPROVED",
  startAt: "",
  endAt: "",
};

function ApprovalDashboardPage() {
  const [approvalStatus, setApprovalStatus] = useState<ApprovalFilterState>(
    INITIAL_APPROVAL_FILTERS,
  );

  const handleFiltersChange = (patch: ApprovalFilterPatch) => {
    setApprovalStatus((prev) => ({ ...prev, ...patch }));
  };

  return (
    <div className="bg-bg-app min-h-dvh w-full">
      <div className="mx-auto w-full max-w-260 px-8 pt-24">
        <div className="flex justify-between">
          <h1 className="font-pretendard tracking-brand text-ui-title text-fg-primary mb-10 font-semibold">
            사업자 등록증 승인 관리
          </h1>
          <div className="flex gap-3">
            <Button>검색 초기화</Button>
            <Button>조회</Button>
          </div>
        </div>

        <SerachField value={approvalStatus} onChange={handleFiltersChange} />

        <DateField value={approvalStatus} onChange={handleFiltersChange} />
      </div>
    </div>
  );
}

export default ApprovalDashboardPage;
