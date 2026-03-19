import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { approveTruckDocument, rejectTruckDocument } from "../../../apis";
import type { ApprovalStatus, ApprovalTableRow } from "../../../types";
import type {
  TruckDocumentRejectPayload,
  TruckDocumentTarget,
} from "../../../types";
import { Modal } from "../../../shared";
import { formatDateTime } from "../../../utils";
import { Button } from "../../../components";

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

function ActionButton({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border-border-control bg-bg-control hover:bg-bg-app h-9 min-w-0 flex-1 cursor-pointer rounded-md border px-1 text-[11px] leading-none font-semibold transition-colors"
    >
      {label}
    </button>
  );
}

function TableRow({ item }: { item: ApprovalTableRow }) {
  const queryClient = useQueryClient();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const trimmedRejectionReason = rejectionReason.trim();
  const isRejectSubmitDisabled = trimmedRejectionReason.length === 0;

  const handleApprove = async ({
    truckId,
    documentType,
  }: TruckDocumentTarget) => {
    try {
      await approveTruckDocument({ truckId, documentType });
      await queryClient.invalidateQueries({
        queryKey: ["truck-document-list"],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleReject = async ({
    truckId,
    documentType,
    rejectionReason,
  }: TruckDocumentRejectPayload) => {
    try {
      await rejectTruckDocument({ truckId, documentType, rejectionReason });
      await queryClient.invalidateQueries({
        queryKey: ["truck-document-list"],
      });
      setIsRejectModalOpen(false);
      setRejectionReason("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {isImageModalOpen && (
        <Modal onClick={() => setIsImageModalOpen(false)}>
          <img
            src={item.imageUrls[0]}
            alt="사업자 등록증 이미지"
            className="w-full max-w-180"
          />
          <div className="mt-6">
            <Modal.Cancled onClick={() => setIsImageModalOpen(false)}>
              닫기
            </Modal.Cancled>
          </div>
        </Modal>
      )}

      {isRejectModalOpen && (
        <Modal
          onClick={() => setIsRejectModalOpen(false)}
          className="max-w-245 items-stretch px-10 py-8"
        >
          <div className="mx-auto w-full max-w-180">
            <Modal.Header
              onClick={() => setIsRejectModalOpen(false)}
              className="border-border-control text-fg-secondary [&>button]:text-fg-muted [&>button]:hover:bg-bg-app [&>button]:hover:text-fg-primary px-0 pt-0 pb-4"
            >
              반려
            </Modal.Header>

            <div className="border-border-control mt-4 border-y">
              <div className="grid grid-cols-[130px_1fr]">
                <div className="bg-bg-app text-fg-secondary px-6 py-4 text-left text-[17px] font-medium">
                  사유
                </div>
                <div className="bg-bg-control px-3 py-3">
                  <textarea
                    value={
                      item.rejectionReason !== null
                        ? item.rejectionReason
                        : rejectionReason
                    }
                    onChange={(event) =>
                      setRejectionReason(event.target.value.slice(0, 20))
                    }
                    disabled={item.rejectionReason !== null}
                    maxLength={20}
                    placeholder="반려 사유를 입력하세요"
                    className="border-border-control bg-bg-app text-fg-primary placeholder:text-fg-muted focus:border-focus-ring focus:ring-focus-ring/30 h-56 w-full resize-none border px-4 py-3 text-[16px] leading-6 outline-none focus:ring-2"
                  />
                </div>
              </div>
            </div>

            <Modal.ButtonLayout className="mt-7 gap-4 px-0 pb-0">
              {item.rejectionReason !== null ? (
                <Button
                  onClick={() => {
                    setIsRejectModalOpen(false);
                  }}
                >
                  닫기
                </Button>
              ) : (
                <>
                  <Button
                    disabled={isRejectSubmitDisabled}
                    onClick={() => {
                      void handleReject({
                        truckId: item.truckId,
                        documentType: item.documentType,
                        rejectionReason: trimmedRejectionReason,
                      });
                    }}
                  >
                    등록
                  </Button>
                  <Modal.Cancled
                    onClick={() => setIsRejectModalOpen(false)}
                    className="border-border-control bg-bg-app text-fg-secondary hover:bg-bg-control mt-0 h-11 min-w-44 px-8 text-[18px] font-semibold"
                  >
                    취소
                  </Modal.Cancled>
                </>
              )}
            </Modal.ButtonLayout>
          </div>
        </Modal>
      )}

      <span>{item.no}</span>
      <span>{item.nickname}</span>
      <span>{item.phone}</span>
      <span>
        {formatBusinessRegistrationNumber(item.businessRegistrationNumber)}
      </span>
      <span>{item.representativeName}</span>
      <span>{item.businessName}</span>
      <span>{formatDateTime(item.openingDate)}</span>
      <span className="flex items-center justify-center">
        {item.imageUrls.length > 0 ? (
          <img
            src={item.imageUrls[0]}
            className="cursor-pointer"
            onClick={() => setIsImageModalOpen(true)}
          />
        ) : (
          "-"
        )}
      </span>
      <span
        className={`${STATUS_CLASS[item.status]} ${item.status === "REJECTED" ? "cursor-pointer" : ""}`}
        onClick={() => {
          setIsRejectModalOpen(true);
        }}
      >
        {STATUS_LABEL[item.status]}
      </span>
      <span className="whitespace-pre-line">
        {formatDateTime(item.requestedAt)}
      </span>
      <span className="whitespace-pre-line">
        {formatDateTime(item.processedAt)}
      </span>

      {item.status === "PENDING" ? (
        <span className="flex w-full min-w-0 flex-row gap-1">
          <ActionButton
            label="승인"
            onClick={() => {
              void handleApprove({
                truckId: item.truckId,
                documentType: item.documentType,
              });
            }}
          />
          <ActionButton
            label="반려"
            onClick={() => {
              setRejectionReason("");
              setIsRejectModalOpen(true);
            }}
          />
        </span>
      ) : (
        <span>-</span>
      )}
    </>
  );
}

export default TableRow;
