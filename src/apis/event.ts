import api from ".";
import type { EventCreateRequestBody, EventItem, EventListResult } from "../types";

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

export type EventDetailResponse = {
  id: string;
  createAt: string;
  data?: {
    id?: string;
    isEventManager?: boolean;
    isLike?: boolean;
    photos?: Array<{
      id?: string;
      path?: string;
    }>;
    recruitInfo?: {
      status?: string;
      isRecruitEndOnSelection?: boolean;
      applicantCount?: number;
      selectedCount?: number;
      recruitCount?: number;
    };
    name?: string;
    regions?: Array<{
      code?: string;
      name?: string;
    }>;
    regionList?: string;
    dates?: Array<{
      id?: string;
      date?: string;
      startTime?: string;
      endTime?: string;
    }>;
    entryFee?: number;
    electricitySupportAvailability?: boolean | null;
    generatorRequirement?: boolean;
    categories?: Array<{
      code?: string;
      name?: string;
    }>;
    documents?: string[];
    type?: string;
    truckTypes?: string[];
    expectedParticipants?: string;
    saleType?: string;
    priceRange?: string;
    cateringDetail?: string;
    contact?: string;
    description?: string;
    guidelines?: string;
    recruitmentUrl?: string;
    isFullAttendanceRequired?: boolean;
    documentSubmissionTarget?: string;
    submissionEmail?: string;
    isRecruitEndOnSelection?: boolean;
    recruitEndDateTime?: string;
  } | null;
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

export const createEvent = async (payload: EventCreateRequestBody) => {
  const res = await api.post("/events/v1/backoffice", payload);
  return res.data;
};

export const getEventDetail = async (eventId: string) => {
  const res = await api.get<EventDetailResponse>(`/events/v1/${eventId}/detail`);
  return res.data?.data ?? null;
};

export const deleteEvent = async (eventId: string) => {
  const res = await api.delete(`/events/v1/${eventId}`);
  return res.data;
};
