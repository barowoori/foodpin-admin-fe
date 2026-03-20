import { useNavigate } from "react-router";
import { Button } from "../components";
import {
  EventBaseInfo,
  EventDetailInfo,
  EventRecruitInfo,
  EventRecruitmentUrlInfo,
  EventTargetInfo,
} from "../components/form";
import { Header } from "../shared";
import { useEventDelete } from "./eventForm/useEventDelete";
import { useEventDetailHydration } from "./eventForm/useEventDetailHydration";
import { useEventFormState } from "./eventForm/useEventFormState";
import { useEventFormSubmit } from "./eventForm/useEventFormSubmit";
import { useEventSectionUpdate } from "./eventForm/useEventSectionUpdate";

type EventSection = "info" | "recruit" | "target" | "detail" | "url";

function EventFormPage() {
  const navigate = useNavigate();

  const {
    baseInfoForm,
    eventRecruitForm,
    eventTargetForm,
    eventDetailForm,
    handleBaseInfoChange,
    handlePeriodTimeChange,
    handleRecruitInfoChange,
    handleTargetInfoChange,
    handleDetailInfoChange,
    hydrateFromDetail,
  } = useEventFormState();

  const { eventId, isDetailMode, isDetailLoading } = useEventDetailHydration({
    hydrateFromDetail,
  });

  const { isPending, handleSubmit } = useEventFormSubmit({
    baseInfoForm,
    eventRecruitForm,
    eventTargetForm,
    eventDetailForm,
  });

  const { isDeletePending, handleDelete } = useEventDelete({ eventId });

  const {
    isInfoUpdating,
    isRecruitUpdating,
    isTargetUpdating,
    isDetailUpdating,
    isRecruitmentUrlUpdating,
    handleInfoUpdate,
    handleRecruitUpdate,
    handleTargetUpdate,
    handleDetailUpdate,
    handleRecruitmentUrlUpdate,
  } = useEventSectionUpdate({
    eventId,
    baseInfoForm,
    eventRecruitForm,
    eventTargetForm,
    eventDetailForm,
  });

  const renderSectionEditButton = (section: EventSection) => {
    if (!isDetailMode) {
      return null;
    }

    if (section === "info") {
      return (
        <div className="flex justify-end">
          <Button
            onClick={handleInfoUpdate}
            disabled={isInfoUpdating}
            className="min-w-24 border-[#cccccc] bg-[#efefef] text-[15px] font-semibold text-[#666666] hover:bg-[#e4e4e4]"
          >
            {isInfoUpdating ? "수정 중.." : "수정"}
          </Button>
        </div>
      );
    }

    if (section === "recruit") {
      return (
        <div className="flex justify-end">
          <Button
            onClick={handleRecruitUpdate}
            disabled={isRecruitUpdating}
            className="min-w-24 border-[#cccccc] bg-[#efefef] text-[15px] font-semibold text-[#666666] hover:bg-[#e4e4e4]"
          >
            {isRecruitUpdating ? "수정 중.." : "수정"}
          </Button>
        </div>
      );
    }

    if (section === "target") {
      return (
        <div className="flex justify-end">
          <Button
            onClick={handleTargetUpdate}
            disabled={isTargetUpdating}
            className="min-w-24 border-[#cccccc] bg-[#efefef] text-[15px] font-semibold text-[#666666] hover:bg-[#e4e4e4]"
          >
            {isTargetUpdating ? "수정 중.." : "수정"}
          </Button>
        </div>
      );
    }

    if (section === "url") {
      return (
        <div className="flex justify-end">
          <Button
            onClick={handleRecruitmentUrlUpdate}
            disabled={isRecruitmentUrlUpdating}
            className="min-w-24 border-[#cccccc] bg-[#efefef] text-[15px] font-semibold text-[#666666] hover:bg-[#e4e4e4]"
          >
            {isRecruitmentUrlUpdating ? "수정 중.." : "수정"}
          </Button>
        </div>
      );
    }

    return (
      <div className="flex justify-end">
        <Button
          onClick={handleDetailUpdate}
          disabled={isDetailUpdating}
          className="min-w-24 border-[#cccccc] bg-[#efefef] text-[15px] font-semibold text-[#666666] hover:bg-[#e4e4e4]"
        >
          {isDetailUpdating ? "수정 중.." : "수정"}
        </Button>
      </div>
    );
  };

  return (
    <div className="bg-bg-app min-h-dvh w-full">
      <Header />

      <div className="mx-auto flex w-full max-w-270 flex-col gap-10 px-2 pt-16 pb-24">
        <div className="flex flex-col gap-4 text-[24px] font-semibold">
          <span className="text-fg-primary">
            {isDetailMode ? "행사 상세 조회" : "행사 등록"}
          </span>
          <div className="tracking-brand mb-2 text-[16px] text-[#f3f3f3]">
            {isDetailMode
              ? "행사 정보를 확인합니다."
              : "행사 정보를 등록합니다."}
            <span className="text-[#ff7e7e]"> (*필수 입력)</span>
          </div>
        </div>

        {isDetailMode && isDetailLoading ? (
          <div className="text-fg-muted rounded-lg border border-[#3f434a] bg-[#262a30] px-4 py-6 text-sm">
            행사 상세 정보를 불러오는 중입니다.
          </div>
        ) : null}

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
            {renderSectionEditButton("info")}
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-fg-secondary text-[18px] font-semibold">
              모집정보
            </h2>
            <EventRecruitInfo
              value={eventRecruitForm}
              onChange={handleRecruitInfoChange}
            />
            {renderSectionEditButton("recruit")}
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-fg-secondary text-[18px] font-semibold">
              운영대상
            </h2>
            <EventTargetInfo
              value={eventTargetForm}
              onChange={handleTargetInfoChange}
            />
            {renderSectionEditButton("target")}
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-fg-secondary text-[18px] font-semibold">
              상세정보
            </h2>
            <EventDetailInfo
              value={eventDetailForm}
              onChange={handleDetailInfoChange}
            />
            {renderSectionEditButton("detail")}
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-fg-secondary text-[18px] font-semibold">
              모집 URL
            </h2>
            <EventRecruitmentUrlInfo
              value={baseInfoForm.recruitmentUrl}
              onChange={(recruitmentUrl) =>
                handleBaseInfoChange({ recruitmentUrl })
              }
            />
            {renderSectionEditButton("url")}
          </section>

          {isDetailMode ? (
            <div className="flex items-center justify-center gap-2 pt-2">
              <Button
                onClick={handleDelete}
                disabled={isDeletePending}
                className="h-14 min-w-32 rounded-none border-[#cccccc] bg-[#efefef] text-[15px] font-semibold text-[#666666] hover:bg-[#e4e4e4]"
              >
                {isDeletePending ? "삭제 중.." : "삭제"}
              </Button>
              <Button
                onClick={() => navigate("/events")}
                className="h-14 min-w-32 rounded-none border-[#cccccc] bg-[#efefef] text-[15px] font-semibold text-[#666666] hover:bg-[#e4e4e4]"
              >
                목록
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                onClick={handleSubmit}
                disabled={isPending}
                className="min-w-28 bg-[#5f738a] hover:bg-[#6b819b]"
              >
                {isPending ? "등록 중.." : "등록"}
              </Button>
              <Button onClick={() => navigate("/events")} className="min-w-28">
                취소
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventFormPage;
