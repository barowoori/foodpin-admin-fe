import api from ".";
import type {
  TruckBodyType,
  TruckCreateRequestBody,
  TruckDetailData,
  TruckDocumentItem,
  TruckDocumentRejectPayload,
  TruckDocumentTarget,
  TruckListItem,
  TruckListResult,
  TruckTypeCode,
  TruckUpdateRequestBody,
} from "../types";

type TruckListPageData = {
  totalElements?: number | null;
  totalPages?: number | null;
  number?: number | null;
  size?: number | null;
  content?: TruckListItem[] | null;
};

type TruckListResponse = {
  id: string;
  createAt: string;
  data?: TruckListPageData | TruckListItem[] | TruckListItem | null;
};

type TruckDetailResponse = {
  id: string;
  createAt: string;
  data?: TruckDetailData | null;
};

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

type TruckCommandResponse = {
  id: string;
  createAt: string;
  data?: string | null;
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

export type TruckBackofficeListParams = {
  region?: string[];
  category?: string[];
  search?: string;
  types?: TruckTypeCode[];
  minAvgMenuPrice?: number;
  maxAvgMenuPrice?: number;
  colors?: string[];
  bodyTypes?: TruckBodyType[];
  paymentMethods?: string[];
  proofIssuanceTypes?: string[];
  isCatering?: boolean;
  isDeleted?: boolean;
  page?: number;
  size?: number;
  sort?: string[];
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

function serializeParams(params: Record<string, unknown>) {
  const searchParams = new URLSearchParams();
  const appendParam = (key: string, value: string | number | boolean) => {
    searchParams.append(key, String(value));
  };

  Object.entries(params).forEach(([key, rawValue]) => {
    if (rawValue === undefined || rawValue === null || rawValue === "") {
      return;
    }

    if (Array.isArray(rawValue)) {
      rawValue
        .filter((value) => value !== "")
        .forEach((value) => appendParam(key, value));
      return;
    }

    if (
      typeof rawValue === "string" ||
      typeof rawValue === "number" ||
      typeof rawValue === "boolean"
    ) {
      appendParam(key, rawValue);
    }
  });

  return searchParams.toString();
}

function isTruckListItem(value: unknown): value is TruckListItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as TruckListItem;
  return typeof item.id === "string" && typeof item.name === "string";
}

function createEmptyTruckListResult(
  createAt: string,
  page: number,
  size: number,
): TruckListResult {
  return {
    createAt,
    content: [],
    totalElements: 0,
    totalPages: 0,
    page,
    size,
  };
}

function isTruckDocumentItem(
  value: TruckDocumentPageData | TruckDocumentItem,
): value is TruckDocumentItem {
  return (
    typeof (value as TruckDocumentItem).truckId === "string" &&
    typeof (value as TruckDocumentItem).documentId === "string"
  );
}

export const getTruckBackofficeList = async (
  params: TruckBackofficeListParams = {},
): Promise<TruckListResult> => {
  const res = await api.get<TruckListResponse>("/trucks/v1/backoffice", {
    params,
    paramsSerializer: {
      serialize: () => serializeParams(params),
    },
  });
  const payload = res.data;
  const createAt = payload.createAt ?? "";
  const data = payload.data;
  const defaultPage = params.page ?? 0;
  const defaultSize = params.size ?? 0;

  if (!data) {
    return createEmptyTruckListResult(createAt, defaultPage, defaultSize);
  }

  if (Array.isArray(data)) {
    return {
      createAt,
      content: data,
      totalElements: data.length,
      totalPages: data.length > 0 ? 1 : 0,
      page: defaultPage,
      size: defaultSize || data.length,
    };
  }

  if (typeof data === "object" && "content" in data) {
    return {
      createAt,
      content: Array.isArray(data.content) ? data.content : [],
      totalElements: data.totalElements ?? 0,
      totalPages: data.totalPages ?? 0,
      page: data.number ?? defaultPage,
      size: data.size ?? defaultSize,
    };
  }

  if (isTruckListItem(data)) {
    return {
      createAt,
      content: [data],
      totalElements: 1,
      totalPages: 1,
      page: defaultPage,
      size: defaultSize || 1,
    };
  }

  return createEmptyTruckListResult(createAt, defaultPage, defaultSize);
};

export const getTruckDetail = async (truckId: string) => {
  const res = await api.get<TruckDetailResponse>(`/trucks/v1/backoffice/${truckId}`);
  return res.data?.data ?? null;
};

export const createTruck = async (payload: TruckCreateRequestBody) => {
  const res = await api.post<TruckCommandResponse>("/trucks/v1/backoffice", payload);
  return res.data;
};

export const updateTruck = async (
  truckId: string,
  payload: TruckUpdateRequestBody,
) => {
  const res = await api.put<TruckCommandResponse>(
    `/trucks/v1/backoffice/${truckId}`,
    payload,
  );
  return res.data;
};

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
