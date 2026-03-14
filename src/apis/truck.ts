import api from ".";
import type { ApprovalStatus } from "../types/approval";

export interface TruckDocumentItem {
  truckId: string;
  documentType: string;
  nickname: string | null;
  phoneNumber: string | null;
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

type TruckDocumentPageData = {
  content?: TruckDocumentItem[] | null;
};

type TruckDocumentListResponse = {
  id: string;
  createAt: string;
  data?: TruckDocumentPageData | TruckDocumentItem[] | TruckDocumentItem | null;
};

function isTruckDocumentItem(
  value: TruckDocumentPageData | TruckDocumentItem,
): value is TruckDocumentItem {
  return (
    typeof (value as TruckDocumentItem).truckId === "string" &&
    typeof (value as TruckDocumentItem).documentId === "string"
  );
}

export const getList = async (): Promise<TruckDocumentItem[]> => {
  const res = await api.get<TruckDocumentListResponse>(
    "/trucks/v1/backoffice/documents",
  );
  const data = res.data.data;

  if (!data) {
    return [];
  }

  if (Array.isArray(data)) {
    return data;
  }

  if ("content" in data && Array.isArray(data.content)) {
    return data.content;
  }

  if (isTruckDocumentItem(data)) {
    return [data];
  }

  return [];
};
