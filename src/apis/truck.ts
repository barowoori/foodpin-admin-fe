import api from ".";
import type {
  TruckDocumentItem,
  TruckDocumentRejectPayload,
  TruckDocumentTarget,
} from "../types/truck";

type TruckDocumentPageData = {
  totalElements?: number | null;
  totalPages?: number | null;
  first?: boolean | null;
  last?: boolean | null;
  size?: number | null;
  content?: TruckDocumentItem[] | null;
  number?: number | null;
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
  page?: number;
  size?: number;
};

export type TruckDocumentListResult = {
  content: TruckDocumentItem[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  first: boolean;
  last: boolean;
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
): Promise<TruckDocumentListResult> => {
  const res = await api.get<TruckDocumentListResponse>(
    `/trucks/v1/backoffice/documents`,
    { params },
  );
  const data = res.data.data;
  const defaultPage = params.page ?? 0;
  const defaultSize = params.size ?? 0;

  if (!data) {
    return {
      content: [],
      totalElements: 0,
      totalPages: 0,
      page: defaultPage,
      size: defaultSize,
      first: true,
      last: true,
    };
  }

  if (Array.isArray(data)) {
    return {
      content: data,
      totalElements: data.length,
      totalPages: data.length > 0 ? 1 : 0,
      page: defaultPage,
      size: defaultSize || data.length,
      first: true,
      last: true,
    };
  }

  if ("content" in data) {
    return {
      content: Array.isArray(data.content) ? data.content : [],
      totalElements: data.totalElements ?? 0,
      totalPages: data.totalPages ?? 0,
      page: data.number ?? defaultPage,
      size: data.size ?? defaultSize,
      first: data.first ?? true,
      last: data.last ?? true,
    };
  }

  if (isTruckDocumentItem(data)) {
    return {
      content: [data],
      totalElements: 1,
      totalPages: 1,
      page: defaultPage,
      size: defaultSize || 1,
      first: true,
      last: true,
    };
  }

  return {
    content: [],
    totalElements: 0,
    totalPages: 0,
    page: defaultPage,
    size: defaultSize,
    first: true,
    last: true,
  };
};

export type { TruckDocumentItem };

export const approveTruckDocument = async ({
  truckId,
  documentType,
}: TruckDocumentTarget) => {
  const res = await api.patch(
    `/trucks/v1/backoffice/${truckId}/documents/${documentType}/approve`,
  );

  return res;
};

export const rejectTruckDocument = async ({
  truckId,
  documentType,
  rejectionReason,
}: TruckDocumentRejectPayload) => {
  const res = await api.patch(
    `/trucks/v1/backoffice/${truckId}/documents/${documentType}/reject`,
    {
      rejectionReason,
    },
  );

  return res;
};
