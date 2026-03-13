export type ApprovalStatus = "APPROVED" | "REJECTED";

export interface ApprovalFilterState {
  nickname: string;
  phone: string;
  approvalStatus: ApprovalStatus;
  startAt: string;
  endAt: string;
}

export type ApprovalFilterPatch = Partial<ApprovalFilterState>;
