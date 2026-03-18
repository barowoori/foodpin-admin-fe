export interface EventRow {
  id: string;
  name: string;
  regionDo: string;
  regionSi: string;
  eventStart: string;
  eventEnd: string;
  recruitmentDeadline: string;
  clickCount: number;
  createdAt: string;
  isFoExposed: boolean;
}

export interface EventTableRow extends EventRow {
  no: number;
}

export interface EventRecruitInfo {
  status: "RECRUITING" | "CLOSED";
  isRecruitEndOnSelection: boolean;
  applicantCount: number;
  selectedCount: number;
  recruitCount: number;
}

export interface EventItem {
  id: string;
  photo: string | null;
  name: string;
  recruitEndDateTime: string;
  startDate: string;
  endDate: string;
  region: string;
  categories: string[];
  recruitInfo: EventRecruitInfo;
  views: number;
  recruitmentUrlClickCount: number;
  isHidden: boolean;
  createdAt?: string | null;
}

export interface EventListResult {
  createAt: string;
  content: EventItem[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface EventFilterState {
  search: string;
  regionDo: string;
  regionSi: string;
  startDate: string;
  endDate: string;
  recruitEndDateFrom: string;
  recruitEndDateTo: string;
  page: number;
  size: number;
}

export type EventFilterPatch = Partial<EventFilterState>;
