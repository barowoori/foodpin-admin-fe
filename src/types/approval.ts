export type ApprovalStatus = "APPROVED" | "REJECTED";

export interface ApprovalFilterState {
  nickname: string;
  phone: string;
  approvalStatus: ApprovalStatus;
  startAt: string;
  endAt: string;
  processedStartAt: string;
  processedEndAt: string;
}

export type ApprovalFilterPatch = Partial<ApprovalFilterState>;
