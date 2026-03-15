export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ApprovalFilterState {
  nickname: string;
  phone: string;
  status: ApprovalStatus;
  requestedStartAt: string;
  requestedEndAt: string;
  processedStartAt: string;
  processedEndAt: string;
}

export type ApprovalFilterPatch = Partial<ApprovalFilterState>;

export interface ApprovalTableRow {
  no: number;
  truckId: string;
  documentType: string;
  documentId: string;
  nickname: string;
  phone: string;
  businessRegistrationNumber: string;
  representativeName: string;
  businessName: string;
  openingDate: string;
  imageUrls: string[];
  status: ApprovalStatus;
  requestedAt: string;
  processedAt: string;
}
