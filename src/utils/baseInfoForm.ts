import type {
  BaseInfoFormState,
  EventDateTime,
  EventDetailFormState,
  EventRecruitFormState,
  EventTargetFormState,
} from "../types";
import { getIsoDateRange } from "./dateRange";

export const INITIAL_EVENT_FORM_BASE_INFO: BaseInfoFormState = {
  name: "",
  type: "",
  expectedParticipants: "정보 없음",
  fileIdList: [],
  photoFiles: [],
  photoPaths: [],
  regionDo: "",
  regionSi: "",
  recruitmentUrl: "",
  eventDateMode: "DATE",
  selectedDates: [],
  periodStartDate: "",
  periodEndDate: "",
  applyTimeToAll: false,
  periodTimeByDate: {},
};

export const INITIAL_EVENT_FORM_RECRUIT: EventRecruitFormState = {
  recruitEndDateTime: "",
  recruitCount: 0,
  isFullAttendanceRequired: true,
  isRecruitEndOnSelection: false,
};

export const INITIAL_EVENT_FORM_TARGET: EventTargetFormState = {
  truckTypes: [],
  eventCategoryCodeList: [],
  saleType: "NORMAL",
  priceRange: "NO_MATTER",
  cateringDetail: "",
};

export const INITIAL_EVENT_FORM_DETAIL: EventDetailFormState = {
  description: "",
  guidelines: "",
  contact: "",
  electricitySupportAvailability: null,
  generatorRequirement: true,
};

function createEmptyTimeSlot(): EventDateTime {
  return {
    startTime: "",
    endTime: "",
  };
}

export function applyBaseInfoPatch(
  prev: BaseInfoFormState,
  patch: Partial<BaseInfoFormState>,
): BaseInfoFormState {
  const next: BaseInfoFormState = { ...prev, ...patch };
  const isDateInputUpdated = Array.isArray(patch.selectedDates);
  const isPeriodInputUpdated =
    typeof patch.periodStartDate === "string" ||
    typeof patch.periodEndDate === "string";

  if (isDateInputUpdated) {
    next.periodStartDate = "";
    next.periodEndDate = "";
  }

  if (isPeriodInputUpdated) {
    next.selectedDates = [];
  }

  if (
    typeof patch.periodStartDate === "string" &&
    next.periodEndDate &&
    patch.periodStartDate > next.periodEndDate
  ) {
    next.periodEndDate = "";
  }

  const activeDates =
    next.eventDateMode === "PERIOD"
      ? getIsoDateRange(next.periodStartDate, next.periodEndDate)
      : [...new Set(next.selectedDates)].sort((a, b) =>
          a < b ? -1 : a > b ? 1 : 0,
        );
  const normalizedTimeByDate: Record<string, EventDateTime> = {};

  activeDates.forEach((date) => {
    normalizedTimeByDate[date] =
      next.periodTimeByDate[date] ?? createEmptyTimeSlot();
  });

  next.periodTimeByDate = normalizedTimeByDate;

  if (next.applyTimeToAll && activeDates.length > 0) {
    const firstDate = activeDates[0];
    const firstTime = next.periodTimeByDate[firstDate] ?? createEmptyTimeSlot();

    activeDates.forEach((date) => {
      next.periodTimeByDate[date] = { ...firstTime };
    });
  }

  if (
    patch.applyTimeToAll === false &&
    prev.applyTimeToAll &&
    activeDates.length > 0
  ) {
    const clearedTimeByDate: Record<string, EventDateTime> = {};
    activeDates.forEach((date) => {
      clearedTimeByDate[date] = createEmptyTimeSlot();
    });
    next.periodTimeByDate = clearedTimeByDate;
  }

  if (activeDates.length === 0) {
    next.applyTimeToAll = false;
  }

  return next;
}

export function applyPeriodTimeChange(
  prev: BaseInfoFormState,
  date: string,
  key: keyof EventDateTime,
  value: string,
): BaseInfoFormState {
  const nextTimeByDate = { ...prev.periodTimeByDate };
  const current = nextTimeByDate[date] ?? createEmptyTimeSlot();
  nextTimeByDate[date] = { ...current, [key]: value };

  if (prev.applyTimeToAll) {
    Object.keys(nextTimeByDate).forEach((targetDate) => {
      nextTimeByDate[targetDate] = {
        ...nextTimeByDate[targetDate],
        [key]: value,
      };
    });
  }

  return {
    ...prev,
    periodTimeByDate: nextTimeByDate,
  };
}
