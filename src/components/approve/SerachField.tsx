import { ApprovalStatusSelect, InputWrapper } from "../../components";
import type {
  ApprovalFilterPatch,
  ApprovalFilterState,
} from "../../types";

type SerachFieldProps = {
  value: ApprovalFilterState;
  onChange: (patch: ApprovalFilterPatch) => void;
};

function SerachField({ value, onChange }: SerachFieldProps) {
  return (
    <div className="flex w-full flex-wrap justify-start gap-20">
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
        <InputWrapper.Label htmlFor="approval-status">승인상태</InputWrapper.Label>

        <ApprovalStatusSelect
          id="approval-status"
          value={value.status}
          onChange={(next) =>
            onChange({ status: next as ApprovalFilterState["status"] })
          }
        />
      </InputWrapper>
    </div>
  );
}

export default SerachField;
