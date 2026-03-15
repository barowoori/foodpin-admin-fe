import api from ".";
import type { TruckDocumentItem } from "../types/truck";

type TruckDocumentPageData = {
  content?: TruckDocumentItem[] | null;
};

type TruckDocumentListResponse = {
  id: string;
  createAt: string;
  data?: TruckDocumentPageData | TruckDocumentItem[] | TruckDocumentItem | null;
};

type TruckDocumentListParams = {
  nickname?: string;
  phone?: string;
  status?: "" | "PENDING" | "APPROVED" | "REJECTED";
  requestedStartAt?: string;
  requestedEndAt?: string;
  processedStartAt?: string;
  processedEndAt?: string;
};

function isTruckDocumentItem(
  value: TruckDocumentPageData | TruckDocumentItem,
): value is TruckDocumentItem {
  return (
    typeof (value as TruckDocumentItem).truckId === "string" &&
    typeof (value as TruckDocumentItem).documentId === "string"
  );
}

export const getList = async (
  params: TruckDocumentListParams = {},
): Promise<TruckDocumentItem[]> => {
  const res = await api.get<TruckDocumentListResponse>(
    `/trucks/v1/backoffice/documents`,
    { params },
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

export type { TruckDocumentItem };
