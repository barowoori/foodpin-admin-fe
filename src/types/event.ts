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
  isHidden: boolean;
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

export type EventType =
  | "CORPORATE"
  | "PERSONAL"
  | "SCHOOL"
  | "LOCAL"
  | "APARTMENT_MARKET"
  | "CELEBRITY_SUPPORT";

export type ExpectedParticipants =
  | "UNDECIDED"
  | "UNDER_50"
  | "UNDER_100"
  | "UNDER_150"
  | "UNDER_200"
  | "OVER_200";

export type EventDateDto = Record<string, unknown>;

export interface BaseInfoState {
  name: string;
  type: EventType;
  expectedParticipants: ExpectedParticipants;
  fileIdList?: string[];
  regionCode: string;
  eventDateDtoList: EventDateDto[];
  recruitmentUrl: string;
}

export type EventDateMode = "DATE" | "PERIOD";

export interface EventDateTime {
  startTime: string;
  endTime: string;
}

export interface BaseInfoFormState {
  name: string;
  type: EventType | "";
  expectedParticipants: ExpectedParticipants;
  fileIdList: string[];
  photoFiles: File[];
  regionDo: string;
  regionSi: string;
  recruitmentUrl: string;
  eventDateMode: EventDateMode;
  selectedDates: string[];
  periodStartDate: string;
  periodEndDate: string;
  applyTimeToAll: boolean;
  periodTimeByDate: Record<string, EventDateTime>;
}
