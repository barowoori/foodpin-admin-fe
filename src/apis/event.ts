import api from ".";
import type { EventItem, EventListResult } from "../types";

type EventPageData = {
  totalElements?: number | null;
  totalPages?: number | null;
  number?: number | null;
  size?: number | null;
  content?: EventItem[] | null;
};

type EventListResponse = {
  id: string;
  createAt: string;
  data?: EventPageData | EventItem[] | EventItem | null;
};

export type EventListParams = {
  search?: string;
  region?: string[];
  startDate?: string;
  endDate?: string;
  recruitEndDateFrom?: string;
  recruitEndDateTo?: string;
  page?: number;
  size?: number;
  sort?: string[];
};

export type UpdateEventHiddenPayload = {
  eventId: string;
  isHidden: boolean;
};

function serializeParams(params: EventListParams) {
  const searchParams = new URLSearchParams();
  const appendParam = (key: string, value: string | number) => {
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

    appendParam(key, rawValue);
  });

  return searchParams.toString();
}

function isEventItem(value: unknown): value is EventItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as EventItem;
  return typeof item.id === "string" && typeof item.name === "string";
}

function createEmptyResult(
  createAt: string,
  page: number,
  size: number,
): EventListResult {
  return {
    createAt,
    content: [],
    totalElements: 0,
    totalPages: 0,
    page,
    size,
  };
}

export const getEvents = async (
  params: EventListParams = {},
): Promise<EventListResult> => {
  const res = await api.get<EventListResponse>("/events/v1/backoffice", {
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
    return createEmptyResult(createAt, defaultPage, defaultSize);
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

  if (isEventItem(data)) {
    return {
      createAt,
      content: [data],
      totalElements: 1,
      totalPages: 1,
      page: defaultPage,
      size: defaultSize || 1,
    };
  }

  return createEmptyResult(createAt, defaultPage, defaultSize);
};

export const updateEventHidden = async ({
  eventId,
  isHidden,
}: UpdateEventHiddenPayload) => {
  const res = await api.patch(`/events/v1/backoffice/${eventId}/hidden`, {
    isHidden,
  });

  return res;
};
