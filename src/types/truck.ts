import type { ApprovalStatus } from "./approval";

export interface TruckDocumentItem {
  truckId: string;
  documentType: string;
  nickname: string | null;
  phoneNumber?: string | null;
  phone?: string | null;
  businessRegistrationNumber: string;
  representativeName: string;
  businessName: string;
  openingDate: string;
  imageUrls: string[];
  status: ApprovalStatus;
  rejectionReason?: string | null;
  requestedAt: string;
  processedAt: string | null;
  documentId: string;
}

export type TruckDocumentTarget = Pick<
  TruckDocumentItem,
  "truckId" | "documentType"
>;

export type TruckDocumentRejectPayload = TruckDocumentTarget & {
  rejectionReason: string;
};
