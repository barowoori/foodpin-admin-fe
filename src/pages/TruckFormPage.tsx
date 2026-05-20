import { useNavigate } from "react-router";
import { Button } from "../components";
import {
  TruckBasicInfoSection,
  TruckDocumentSection,
  TruckMenuSection,
  TruckOperationSection,
  TruckOwnerSection,
  TruckPaymentSection,
} from "../components/truckForm";
import { useTruckDetailHydration } from "../features/truckForm/useTruckDetailHydration";
import { useTruckFormState } from "../features/truckForm/useTruckFormState";
import { useTruckFormSubmit } from "../features/truckForm/useTruckFormSubmit";
import { Header } from "../shared";

const PAGE_SECONDARY_BUTTON_CLASS =
  "h-14 min-w-32 rounded-none border-[#cccccc] bg-[#efefef] text-[15px] font-semibold text-[#666666] hover:bg-[#e4e4e4]";
const PAGE_PRIMARY_BUTTON_CLASS =
  "h-14 min-w-32 rounded-none border-[#6f8198] bg-[#5f738a] text-[15px] font-semibold text-white hover:bg-[#6b819b]";

function TruckFormPage() {
  const navigate = useNavigate();
  const {
    ownerForm,
    basicInfoForm,
    operationForm,
    menuForm,
    paymentForm,
    documentForm,
    handleOwnerChange,
    handleBasicInfoChange,
    handleOperationChange,
    handleMenuChange,
    handleMenuItemChange,
    handleAddMenuItem,
    handleRemoveMenuItem,
    handlePaymentChange,
    handleDocumentChange,
    hydrateFromDetail,
  } = useTruckFormState();

  const { truckId, truckDetail, isDetailMode, isDetailLoading } =
    useTruckDetailHydration({
      hydrateFromDetail,
    });

  const { isPending, handleSubmit } = useTruckFormSubmit({
    truckId,
    isDetailMode,
    formState: {
      ownerForm,
      basicInfoForm,
      operationForm,
      menuForm,
      paymentForm,
      documentForm,
    },
  });

  const isSubmitDisabled =
    isPending || (isDetailMode && truckDetail?.isAvailableUpdate === false);

  return (
    <div className="bg-bg-app min-h-dvh w-full">
      <Header />

      <div className="mx-auto flex w-full max-w-270 flex-col gap-8 px-2 pt-12 pb-20">
        <div className="flex flex-col gap-3 text-[22px] font-semibold">
          <span className="text-fg-primary">
            {isDetailMode ? "푸드트럭 상세 정보" : "푸드트럭 등록"}
          </span>
          <div className="tracking-brand mb-1 text-[14px] text-[#f3f3f3]">
            {isDetailMode
              ? "푸드트럭 정보를 확인하고 수정할 수 있습니다."
              : "푸드트럭 정보를 등록합니다."}
            <span className="text-[#ff7e7e]"> (*필수 입력)</span>
          </div>
        </div>

        {isDetailMode && isDetailLoading ? (
          <div className="text-fg-muted rounded-lg border border-[#3f434a] bg-[#262a30] px-4 py-6 text-sm">
            푸드트럭 상세 정보를 불러오는 중입니다.
          </div>
        ) : null}

        <div className="flex flex-col gap-10">
          {!isDetailMode ? (
            <section className="flex flex-col gap-3">
              <h2 className="text-fg-secondary text-[16px] font-semibold">
                소유자 정보
              </h2>
              <TruckOwnerSection value={ownerForm} onChange={handleOwnerChange} />
            </section>
          ) : null}

          <section className="flex flex-col gap-3">
            <h2 className="text-fg-secondary text-[16px] font-semibold">
              기본정보
            </h2>
            <TruckBasicInfoSection
              value={basicInfoForm}
              onChange={handleBasicInfoChange}
            />
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-fg-secondary text-[16px] font-semibold">
              운영정보
            </h2>
            <TruckOperationSection
              value={operationForm}
              onChange={handleOperationChange}
            />
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-fg-secondary text-[16px] font-semibold">
              메뉴정보
            </h2>
            <TruckMenuSection
              value={menuForm}
              onChange={handleMenuChange}
              onMenuItemChange={handleMenuItemChange}
              onAddMenuItem={handleAddMenuItem}
              onRemoveMenuItem={handleRemoveMenuItem}
            />
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-fg-secondary text-[16px] font-semibold">
              결제정보
            </h2>
            <TruckPaymentSection
              value={paymentForm}
              onChange={handlePaymentChange}
            />
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-fg-secondary text-[16px] font-semibold">
              사업자등록증
            </h2>
            <TruckDocumentSection
              value={documentForm}
              onChange={handleDocumentChange}
            />
          </section>

          <div className="flex items-center justify-center gap-2 pt-2">
            <Button
              onClick={() => {
                void handleSubmit();
              }}
              disabled={isSubmitDisabled}
              className={PAGE_PRIMARY_BUTTON_CLASS}
            >
              {isPending
                ? isDetailMode
                  ? "수정 중..."
                  : "등록 중..."
                : isDetailMode
                  ? "수정"
                  : "등록"}
            </Button>
            <Button
              onClick={() => navigate("/trucks")}
              className={PAGE_SECONDARY_BUTTON_CLASS}
            >
              {isDetailMode ? "목록" : "취소"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TruckFormPage;
