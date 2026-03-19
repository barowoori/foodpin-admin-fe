import { useState } from "react";
import BaseInfo from "../components/form/BaseInfo";
import { Header } from "../shared";
import type { BaseInfoFormState, EventDateTime } from "../types";
import {
  applyBaseInfoPatch,
  applyPeriodTimeChange,
  INITIAL_EVENT_FORM_BASE_INFO,
} from "../utils";

function EventFormPage() {
  const [baseInfoForm, setBaseInfoForm] = useState<BaseInfoFormState>(
    INITIAL_EVENT_FORM_BASE_INFO,
  );

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

  return (
    <div className="bg-bg-app min-h-dvh w-full">
      <Header />

      <div className="mx-auto w-full max-w-270 px-2 pt-16 pb-24">
        <div className="flex flex-col gap-4 text-[24px] font-semibold">
          <span className="text-fg-primary">행사 등록</span>
          <div className="tracking-brand mb-5 text-[16px] text-[#f3f3f3]">
            행사 정보를 등록합니다.{" "}
            <span className="text-[#ff7e7e]">*필수 입력</span>
          </div>
        </div>

        <BaseInfo
          value={baseInfoForm}
          onChange={handleBaseInfoChange}
          onPeriodTimeChange={handlePeriodTimeChange}
        />
      </div>
    </div>
  );
}

export default EventFormPage;
