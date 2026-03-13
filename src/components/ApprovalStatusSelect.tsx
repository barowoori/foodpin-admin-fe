import ArrowIcon from "../assets/arrow.svg?react";

export type ApprovalStatus = "APPROVED" | "REJECTED";

const APPROVAL_STATUS_OPTIONS: { value: ApprovalStatus; label: string }[] = [
  { value: "APPROVED", label: "승인" },
  { value: "REJECTED", label: "반려" },
];

type ApprovalStatusSelectProps = {
  id?: string;
  value?: ApprovalStatus;
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
        className="font-pretendard h-11 w-28 cursor-pointer appearance-none rounded-lg border border-[#5a5a5a] bg-[#2b2b2b] px-3 pr-7 text-sm text-[#fafafa] transition outline-none focus:border-[#6f8198] focus:ring-2 focus:ring-[#6f8198]/30"
      >
        {APPROVAL_STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ArrowIcon className="pointer-events-none absolute top-1/2 right-2.5 h-3 w-3 -translate-y-1/2 text-[#9AA5B5]" />
    </div>
  );
}

export default ApprovalStatusSelect;
