import type { ApprovalStatus, ApprovalTableRow } from "../../../types/approval";
import { formatDateTime } from "../../../utils/formatDateTime";

const STATUS_LABEL: Record<ApprovalStatus, string> = {
  PENDING: "승인대기",
  APPROVED: "승인",
  REJECTED: "반려",
};

const STATUS_CLASS: Record<ApprovalStatus, string> = {
  PENDING: "text-amber-500",
  APPROVED: "text-emerald-500",
  REJECTED: "text-[#0692E7]",
};

function formatBusinessRegistrationNumber(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.length >= 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }

  if (digits.length > 6) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  if (digits.length > 3) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }

  return value;
}

function ActionButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="border-border-control bg-bg-control hover:bg-bg-app h-9 min-w-0 flex-1 cursor-pointer rounded-md border px-1 text-[11px] leading-none font-semibold transition-colors"
    >
      {label}
    </button>
  );
}

function TableRow({ item }: { item: ApprovalTableRow }) {
  return (
    <>
      <span>{item.no}</span>
      <span>{item.nickname}</span>
      <span>{item.phone}</span>
      <span>
        {formatBusinessRegistrationNumber(item.businessRegistrationNumber)}
      </span>
      <span>{item.representativeName}</span>
      <span>{item.businessName}</span>
      <span>{formatDateTime(item.openingDate)}</span>
      <span>{item.imageUrls.length > 0 ? "{이미지 미리보기}" : "-"}</span>
      <span className={STATUS_CLASS[item.status]}>
        {STATUS_LABEL[item.status]}
      </span>
      <span className="whitespace-pre-line">
        {formatDateTime(item.requestedAt)}
      </span>
      <span className="whitespace-pre-line">
        {formatDateTime(item.processedAt)}
      </span>

      {STATUS_LABEL[item.status] === "승인대기" && (
        <span className="flex w-full min-w-0 flex-row gap-1">
          <ActionButton label="승인" />
          <ActionButton label="반려" />
        </span>
      )}
    </>
  );
}

export default TableRow;
