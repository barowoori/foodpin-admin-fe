import api from ".";
import type { MemberSearchItem, MemberSearchResult } from "../types";

type MemberPageData = {
  totalElements?: number | null;
  totalPages?: number | null;
  first?: boolean | null;
  last?: boolean | null;
  size?: number | null;
  content?: MemberSearchItem[] | null;
  number?: number | null;
};

type MemberSearchResponse = {
  id: string;
  createAt: string;
  data?: MemberPageData | MemberSearchItem[] | MemberSearchItem | null;
};

export type MemberBackofficeSearchParams = {
  search?: string;
  page?: number;
  size?: number;
  sort?: string[];
};

function serializeParams(params: MemberBackofficeSearchParams) {
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

function isMemberSearchItem(value: unknown): value is MemberSearchItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as MemberSearchItem;
  return typeof item.memberId === "string";
}

function createEmptyMemberSearchResult(
  createAt: string,
  page: number,
  size: number,
): MemberSearchResult {
  return {
    createAt,
    content: [],
    totalElements: 0,
    totalPages: 0,
    page,
    size,
    first: true,
    last: true,
  };
}

export const searchMembers = async (
  params: MemberBackofficeSearchParams,
): Promise<MemberSearchResult> => {
  const res = await api.get<MemberSearchResponse>("/members/v1/backoffice/search", {
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
    return createEmptyMemberSearchResult(createAt, defaultPage, defaultSize);
  }

  if (Array.isArray(data)) {
    return {
      createAt,
      content: data,
      totalElements: data.length,
      totalPages: data.length > 0 ? 1 : 0,
      page: defaultPage,
      size: defaultSize || data.length,
      first: true,
      last: true,
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
      first: data.first ?? true,
      last: data.last ?? true,
    };
  }

  if (isMemberSearchItem(data)) {
    return {
      createAt,
      content: [data],
      totalElements: 1,
      totalPages: 1,
      page: defaultPage,
      size: defaultSize || 1,
      first: true,
      last: true,
    };
  }

  return createEmptyMemberSearchResult(createAt, defaultPage, defaultSize);
};
