import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components";
import {
  EventBaseInfo,
  EventDetailInfo,
  EventRecruitInfo,
  EventRecruitmentUrlInfo,
  EventTargetInfo,
} from "../components/form";
import { Header, Modal } from "../shared";
import { useEventDelete } from "../features/eventForm/useEventDelete";
import { useEventDetailHydration } from "../features/eventForm/useEventDetailHydration";
import { useEventFormState } from "../features/eventForm/useEventFormState";
import { useEventFormSubmit } from "../features/eventForm/useEventFormSubmit";
import { useEventSectionUpdate } from "../features/eventForm/useEventSectionUpdate";
import { isCreateEventTextLengthValid } from "../features/eventForm/textLengthValidation";
import {
  clampRecruitEndDateTimeToEventEndDate,
  getEventEndDateTime,
} from "../features/eventForm/formModel";

type EventSection = "info" | "recruit" | "target" | "detail" | "url";
const PAGE_SECONDARY_BUTTON_CLASS =
  "h-14 min-w-32 rounded-none border-[#cccccc] bg-[#efefef] text-[15px] font-semibold text-[#666666] hover:bg-[#e4e4e4]";
const PAGE_PRIMARY_BUTTON_CLASS =
  "h-14 min-w-32 rounded-none border-[#6f8198] bg-[#5f738a] text-[15px] font-semibold text-white hover:bg-[#6b819b]";

function EventFormPage() {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCreateSubmitAttempted, setIsCreateSubmitAttempted] = useState(false);

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

  const isCreateTextLengthValid = useMemo(
    () =>
      isCreateEventTextLengthValid({
        name: baseInfoForm.name,
        saleType: eventTargetForm.saleType,
        cateringDetail: eventTargetForm.cateringDetail,
        description: eventDetailForm.description,
        guidelines: eventDetailForm.guidelines,
      }),
    [
      baseInfoForm.name,
      eventDetailForm.description,
      eventDetailForm.guidelines,
      eventTargetForm.cateringDetail,
      eventTargetForm.saleType,
    ],
  );
  const isCreateSubmitDisabled = isPending || !isCreateTextLengthValid;
  const eventEndDateTime = useMemo(
    () => getEventEndDateTime(baseInfoForm),
    [baseInfoForm],
  );

  useEffect(() => {
    if (!eventRecruitForm.recruitEndDateTime || !eventEndDateTime) {
      return;
    }

    const clampedRecruitEndDateTime = clampRecruitEndDateTimeToEventEndDate(
      eventRecruitForm.recruitEndDateTime,
      eventEndDateTime,
    );

    if (clampedRecruitEndDateTime !== eventRecruitForm.recruitEndDateTime) {
      handleRecruitInfoChange({ recruitEndDateTime: clampedRecruitEndDateTime });
    }
  }, [
    eventEndDateTime,
    eventRecruitForm.recruitEndDateTime,
    handleRecruitInfoChange,
  ]);

  const handleDeleteConfirm = async () => {
    const isDeleted = await handleDelete();
    if (isDeleted) {
      setIsDeleteModalOpen(false);
    }
  };

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
              showNameValidationError={!isDetailMode && isCreateSubmitAttempted}
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
              maxRecruitEndDateTime={eventEndDateTime}
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
              showCateringValidationError={
                !isDetailMode && isCreateSubmitAttempted
              }
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
              showTextValidationError={!isDetailMode && isCreateSubmitAttempted}
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
                onClick={() => setIsDeleteModalOpen(true)}
                disabled={isDeletePending}
                className={PAGE_SECONDARY_BUTTON_CLASS}
              >
                {isDeletePending ? "삭제 중.." : "삭제"}
              </Button>
              <Button
                onClick={() => navigate("/events")}
                className={PAGE_SECONDARY_BUTTON_CLASS}
              >
                목록
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 pt-2">
              <div
                onMouseDownCapture={() => setIsCreateSubmitAttempted(true)}
                onTouchStartCapture={() => setIsCreateSubmitAttempted(true)}
              >
                <Button
                  onClick={() => {
                    if (!isCreateTextLengthValid) {
                      return;
                    }

                    void handleSubmit();
                  }}
                  disabled={isCreateSubmitDisabled}
                  className={PAGE_PRIMARY_BUTTON_CLASS}
                >
                  {isPending ? "등록 중.." : "등록"}
                </Button>
              </div>
              <Button
                onClick={() => setIsCancelModalOpen(true)}
                className={PAGE_SECONDARY_BUTTON_CLASS}
              >
                취소
              </Button>
            </div>
          )}
        </div>
      </div>

      {isDetailMode && isDeleteModalOpen ? (
        <Modal
          onClick={() => setIsDeleteModalOpen(false)}
          className="max-w-150 border-[#4a505a] bg-[#2b3038] px-8 py-8"
        >
          <div className="w-full max-w-120">
            <Modal.Header className="justify-center pt-2 pb-2 text-[26px] font-bold text-[#f3f6fb]">
              행사 삭제
            </Modal.Header>
            <Modal.Description className="mt-2 text-center text-[16px] font-medium text-[#d5dce6]">
              행사를 삭제하시겠습니까?
            </Modal.Description>
            <Modal.ButtonLayout className="mt-8 gap-4">
              <Button
                onClick={handleDeleteConfirm}
                disabled={isDeletePending}
                className="border-focus-ring h-11 min-w-28 bg-[#5f738a] text-[16px] font-semibold text-white hover:bg-[#6f859f]"
              >
                {isDeletePending ? "삭제 중.." : "확인"}
              </Button>
              <Button
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeletePending}
                className="h-11 min-w-28 border-[#5d636d] bg-[#343a43] text-[16px] font-semibold text-[#e3e8ee] hover:bg-[#414852]"
              >
                취소
              </Button>
            </Modal.ButtonLayout>
          </div>
        </Modal>
      ) : null}

      {!isDetailMode && isCancelModalOpen ? (
        <Modal
          onClick={() => setIsCancelModalOpen(false)}
          className="max-w-150 border-[#4a505a] bg-[#2b3038] px-8 py-8"
        >
          <div className="w-full max-w-120">
            <Modal.Header className="justify-center pt-2 pb-2 text-[26px] font-bold text-[#f3f6fb]">
              등록 취소
            </Modal.Header>
            <Modal.Description className="mt-2 text-center text-[15px] leading-6 font-medium text-[#d5dce6]">
              입력 중인 내용이 저장되지 않습니다.
              {"\n"}
              목록으로 이동하시겠습니까?
            </Modal.Description>
            <Modal.ButtonLayout className="mt-8 gap-4">
              <Button
                onClick={() => {
                  setIsCancelModalOpen(false);
                  navigate("/events");
                }}
                className="border-focus-ring h-11 min-w-28 bg-[#5f738a] text-[16px] font-semibold text-white hover:bg-[#6f859f]"
              >
                확인
              </Button>
              <Button
                onClick={() => setIsCancelModalOpen(false)}
                className="h-11 min-w-28 border-[#5d636d] bg-[#343a43] text-[16px] font-semibold text-[#e3e8ee] hover:bg-[#414852]"
              >
                취소
              </Button>
            </Modal.ButtonLayout>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}

export default EventFormPage;
