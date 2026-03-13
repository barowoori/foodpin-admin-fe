import ArrowIcon from "../assets/arrow.svg?react";
import type { ApprovalStatus } from "../types/approval";

const APPROVAL_STATUS_OPTIONS: { value: ApprovalStatus; label: string }[] = [
  { value: "APPROVED", label: "승인" },
  { value: "REJECTED", label: "반려" },
];

type ApprovalStatusSelectProps = {
  id?: string;
  value: ApprovalStatus;
  onChange: (value: ApprovalStatus) => void;
};

function ApprovalStatusSelect({
  id,
  value,
  onChange,
}: ApprovalStatusSelectProps) {
  return (
    <div className="relative w-fit">
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as ApprovalStatus)}
        className="font-pretendard border-border-control bg-bg-control text-ui-sm text-fg-primary focus:border-focus-ring focus:ring-focus-ring/30 h-11 w-28 cursor-pointer appearance-none rounded-lg border px-3 pr-7 transition outline-none focus:ring-2"
      >
        {APPROVAL_STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ArrowIcon className="text-icon-primary pointer-events-none absolute top-1/2 right-2.5 h-3 w-3 -translate-y-1/2" />
    </div>
  );
}

export default ApprovalStatusSelect;
