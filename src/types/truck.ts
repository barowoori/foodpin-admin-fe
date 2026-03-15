import type { ApprovalStatus } from "./approval";

export interface TruckDocumentItem {
  truckId: string;
  documentType: string;
  nickname: string | null;
  phone: string | null;
  businessRegistrationNumber: string;
  representativeName: string;
  businessName: string;
  openingDate: string;
  imageUrls: string[];
  status: ApprovalStatus;
  requestedAt: string;
  processedAt: string | null;
  documentId: string;
}
