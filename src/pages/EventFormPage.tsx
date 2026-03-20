import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { createEvent } from "../apis";
import { Button } from "../components";
import {
  EventBaseInfo,
  EventDetailInfo,
  EventRecruitInfo,
  EventTargetInfo,
} from "../components/form";
import { Header } from "../shared";
import type {
  BaseInfoFormState,
  EventCreateRequestBody,
  EventDateTime,
  EventDetailFormState,
  EventRecruitFormState,
  EventTargetFormState,
  EventType,
} from "../types";
import {
  applyBaseInfoPatch,
  applyPeriodTimeChange,
  getIsoDateRange,
  INITIAL_EVENT_FORM_BASE_INFO,
  INITIAL_EVENT_FORM_DETAIL,
  INITIAL_EVENT_FORM_RECRUIT,
  INITIAL_EVENT_FORM_TARGET,
} from "../utils";

function normalizeTimeValue(value: string) {
  if (!value) {
    return "00:00:00";
  }

  return value.length === 5 ? `${value}:00` : value;
}

function toIsoDateTime(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toISOString();
}

function EventFormPage() {
  const navigate = useNavigate();
  const [baseInfoForm, setBaseInfoForm] = useState<BaseInfoFormState>(
    INITIAL_EVENT_FORM_BASE_INFO,
  );
  const [eventRecruitForm, setEventRecruitForm] =
    useState<EventRecruitFormState>(INITIAL_EVENT_FORM_RECRUIT);
  const [eventTargetForm, setEventTargetForm] = useState<EventTargetFormState>(
    INITIAL_EVENT_FORM_TARGET,
  );
  const [eventDetailForm, setEventDetailForm] = useState<EventDetailFormState>(
    INITIAL_EVENT_FORM_DETAIL,
  );

  const { mutateAsync: mutateCreateEvent, isPending } = useMutation({
    mutationFn: createEvent,
  });

  const handleBaseInfoChange = (patch: Partial<BaseInfoFormState>) => {
    setBaseInfoForm((prev) => applyBaseInfoPatch(prev, patch));
  };

  const handlePeriodTimeChange = (
    date: string,
    key: keyof EventDateTime,
    value: string,
  ) => {
    setBaseInfoForm((prev) => applyPeriodTimeChange(prev, date, key, value));
  };

  const handleRecruitInfoChange = (patch: Partial<EventRecruitFormState>) => {
    setEventRecruitForm((prev) => ({ ...prev, ...patch }));
  };

  const handleTargetInfoChange = (patch: Partial<EventTargetFormState>) => {
    setEventTargetForm((prev) => ({ ...prev, ...patch }));
  };

  const handleDetailInfoChange = (patch: Partial<EventDetailFormState>) => {
    setEventDetailForm((prev) => ({ ...prev, ...patch }));
  };

  const buildEventDateDtoList = () => {
    if (baseInfoForm.eventDateMode === "PERIOD") {
      const dates = getIsoDateRange(
        baseInfoForm.periodStartDate,
        baseInfoForm.periodEndDate,
      );

      return dates.map((date) => {
        const time = baseInfoForm.periodTimeByDate[date];

        return {
          date,
          startTime: normalizeTimeValue(time?.startTime ?? ""),
          endTime: normalizeTimeValue(time?.endTime ?? ""),
        };
      });
    }

    return baseInfoForm.selectedDates.map((date) => ({
      date,
      startTime: "00:00:00",
      endTime: "00:00:00",
    }));
  };

  const buildRequestBody = (): EventCreateRequestBody | null => {
    if (!baseInfoForm.name.trim()) {
      alert("행사명을 입력해주세요.");
      return null;
    }

    if (!baseInfoForm.type) {
      alert("행사 종류를 선택해주세요.");
      return null;
    }

    const regionCode = baseInfoForm.regionSi || baseInfoForm.regionDo;
    if (!regionCode) {
      alert("행사 지역을 선택해주세요.");
      return null;
    }

    const eventDateDtoList = buildEventDateDtoList();
    if (eventDateDtoList.length === 0) {
      alert("행사 일시를 선택해주세요.");
      return null;
    }

    if (!eventRecruitForm.recruitEndDateTime) {
      alert("모집마감일을 입력해주세요.");
      return null;
    }

    if (eventTargetForm.truckTypes.length === 0) {
      alert("푸드트럭 유형을 1개 이상 선택해주세요.");
      return null;
    }

    if (eventTargetForm.eventCategoryCodeList.length === 0) {
      alert("메뉴 카테고리를 1개 이상 선택해주세요.");
      return null;
    }

    if (!eventDetailForm.description.trim()) {
      alert("상세설명을 입력해주세요.");
      return null;
    }

    if (!eventDetailForm.guidelines.trim()) {
      alert("유의사항을 입력해주세요.");
      return null;
    }

    if (!eventDetailForm.contact.trim()) {
      alert("연락처를 입력해주세요.");
      return null;
    }

    const recruitEndDateTimeIso = toIsoDateTime(
      eventRecruitForm.recruitEndDateTime,
    );
    if (!recruitEndDateTimeIso) {
      alert("모집마감일 형식이 올바르지 않습니다.");
      return null;
    }

    return {
      eventInfoDto: {
        name: baseInfoForm.name.trim(),
        type: baseInfoForm.type as EventType,
        expectedParticipants: baseInfoForm.expectedParticipants,
        fileIdList: baseInfoForm.fileIdList,
        regionCode,
        eventDateDtoList,
        recruitmentUrl: baseInfoForm.recruitmentUrl.trim(),
      },
      eventRecruitDto: {
        recruitEndDateTime: recruitEndDateTimeIso,
        recruitCount: Math.max(0, eventRecruitForm.recruitCount),
        isFullAttendanceRequired: eventRecruitForm.isFullAttendanceRequired,
        isRecruitEndOnSelection: eventRecruitForm.isRecruitEndOnSelection,
      },
      eventTargetDto: {
        truckTypes: eventTargetForm.truckTypes,
        eventCategoryCodeList: eventTargetForm.eventCategoryCodeList,
        saleType: eventTargetForm.saleType,
        priceRange: eventTargetForm.priceRange,
        cateringDetail: eventTargetForm.cateringDetail.trim(),
      },
      eventDetailDto: {
        description: eventDetailForm.description.trim(),
        guidelines: eventDetailForm.guidelines.trim(),
        contact: eventDetailForm.contact.trim(),
        electricitySupportAvailability:
          eventDetailForm.electricitySupportAvailability,
        generatorRequirement: eventDetailForm.generatorRequirement,
      },
    };
  };

  const handleSubmit = async () => {
    const requestBody = buildRequestBody();
    if (!requestBody) {
      return;
    }

    try {
      await mutateCreateEvent(requestBody);
      navigate("/events");
    } catch (error) {
      console.error("Failed to create event", error);
      alert("행사 등록에 실패했습니다.");
    }
  };

  return (
    <div className="bg-bg-app min-h-dvh w-full">
      <Header />

      <div className="mx-auto flex w-full max-w-270 flex-col gap-10 px-2 pt-16 pb-24">
        <div className="flex flex-col gap-4 text-[24px] font-semibold">
          <span className="text-fg-primary">행사 등록</span>
          <div className="tracking-brand mb-2 text-[16px] text-[#f3f3f3]">
            행사 정보를 등록합니다.{" "}
            <span className="text-[#ff7e7e]">(*필수 입력)</span>
          </div>
        </div>

        <div className="flex flex-col gap-12">
          <section className="flex flex-col gap-4">
            <h2 className="text-fg-secondary text-[18px] font-semibold">
              기본정보
            </h2>
            <EventBaseInfo
              value={baseInfoForm}
              onChange={handleBaseInfoChange}
              onPeriodTimeChange={handlePeriodTimeChange}
            />
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-fg-secondary text-[18px] font-semibold">
              모집정보
            </h2>
            <EventRecruitInfo
              value={eventRecruitForm}
              onChange={handleRecruitInfoChange}
            />
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-fg-secondary text-[18px] font-semibold">
              운영대상
            </h2>
            <EventTargetInfo
              value={eventTargetForm}
              onChange={handleTargetInfoChange}
            />
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-fg-secondary text-[18px] font-semibold">
              상세정보
            </h2>
            <EventDetailInfo
              value={eventDetailForm}
              onChange={handleDetailInfoChange}
            />
          </section>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              className="min-w-28 bg-[#5f738a] hover:bg-[#6b819b]"
            >
              {isPending ? "등록 중..." : "등록"}
            </Button>
            <Button onClick={() => navigate("/events")} className="min-w-28">
              취소
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventFormPage;
