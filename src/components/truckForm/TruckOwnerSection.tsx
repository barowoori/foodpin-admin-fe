import { FormBox, FormInput, FormTextArea } from "../form";
import type { TruckOwnerFormState } from "../../types";

type TruckOwnerSectionProps = {
  value: TruckOwnerFormState;
  onChange: (patch: Partial<TruckOwnerFormState>) => void;
};

function TruckOwnerSection({ value, onChange }: TruckOwnerSectionProps) {
  return (
    <FormBox>
      <FormBox.Row label="소유자 회원 ID" required>
        <FormInput
          value={value.ownerMemberId}
          onChange={(event) => onChange({ ownerMemberId: event.target.value })}
          placeholder="소유자 회원 ID를 입력하세요"
          className="w-full max-w-120"
        />
      </FormBox.Row>

      <FormBox.Row label="관리자 회원 ID">
        <div className="w-full max-w-160">
          <FormTextArea
            value={value.managerMemberIdsText}
            onChange={(event) =>
              onChange({ managerMemberIdsText: event.target.value })
            }
            placeholder="쉼표(,) 또는 줄바꿈으로 여러 관리자 ID를 입력하세요"
            className="min-h-24"
          />
          <p className="text-fg-muted mt-2 text-xs">
            예: member-id-1, member-id-2
          </p>
        </div>
      </FormBox.Row>
    </FormBox>
  );
}

export default TruckOwnerSection;
