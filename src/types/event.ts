export interface EventRow {
  id: number;
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

export interface EventFilterState {
  name: string;
  regionDo: string;
  regionSi: string;
  eventStartAt: string;
  eventEndAt: string;
  deadlineStartAt: string;
  deadlineEndAt: string;
  page: number;
  size: number;
}

export type EventFilterPatch = Partial<EventFilterState>;
