import { FormSelect, InputWrapper } from "../../components";
import type { ApprovalFilterPatch, ApprovalFilterState } from "../../types";

type SerachFieldProps = {
  value: ApprovalFilterState;
  onChange: (patch: ApprovalFilterPatch) => void;
};

const APPROVAL_STATUS_OPTIONS = [
  { value: "", label: "선택" },
  { value: "PENDING", label: "승인대기" },
  { value: "APPROVED", label: "승인" },
  { value: "REJECTED", label: "반려" },
] as const;

function SerachField({ value, onChange }: SerachFieldProps) {
  return (
    <div className="grid w-full grid-cols-1 gap-y-5 lg:flex lg:flex-wrap lg:justify-start lg:gap-10">
      <InputWrapper>
        <InputWrapper.Label htmlFor="nickname">닉네임</InputWrapper.Label>
        <InputWrapper.Input
          id="nickname"
          type="text"
          value={value.nickname}
          onChange={(event) => onChange({ nickname: event.target.value })}
        />
      </InputWrapper>

      <InputWrapper>
        <InputWrapper.Label htmlFor="phone-number">
          휴대폰번호
        </InputWrapper.Label>
        <InputWrapper.Input
          id="phone-number"
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          value={value.phone}
          onChange={(event) =>
            onChange({ phone: event.target.value.replace(/\D/g, "") })
          }
        />
      </InputWrapper>

      <InputWrapper>
        <InputWrapper.Label htmlFor="approval-status">
          승인상태
        </InputWrapper.Label>

        <FormSelect
          id="approval-status"
          value={value.status}
          options={[...APPROVAL_STATUS_OPTIONS]}
          onChange={(next) =>
            onChange({ status: next as ApprovalFilterState["status"] })
          }
        />
      </InputWrapper>
    </div>
  );
}

export default SerachField;

