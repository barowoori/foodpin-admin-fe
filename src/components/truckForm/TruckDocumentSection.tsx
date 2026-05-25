import { FormBox, FormInput } from "../form";
import type { TruckDocumentFormState } from "../../types";
import TruckImageUploadField from "./TruckImageUploadField";

type TruckDocumentSectionProps = {
  value: TruckDocumentFormState;
  onChange: (patch: Partial<TruckDocumentFormState>) => void;
};

function TruckDocumentSection({
  value,
  onChange,
}: TruckDocumentSectionProps) {
  return (
    <FormBox className="overflow-visible">
      <FormBox.Row label="사업자등록번호">
        <FormInput
          value={value.businessNumber}
          onChange={(event) => onChange({ businessNumber: event.target.value })}
          placeholder="사업자등록번호를 입력하세요"
          className="w-full max-w-100"
        />
      </FormBox.Row>

      <FormBox.Row label="상호명">
        <FormInput
          value={value.businessName}
          onChange={(event) => onChange({ businessName: event.target.value })}
          placeholder="상호명을 입력하세요"
          className="w-full max-w-100"
        />
      </FormBox.Row>

      <FormBox.Row label="대표자명">
        <FormInput
          value={value.representativeName}
          onChange={(event) =>
            onChange({ representativeName: event.target.value })
          }
          placeholder="대표자명을 입력하세요"
          className="w-full max-w-100"
        />
      </FormBox.Row>

      <FormBox.Row label="개업일자">
        <FormInput
          type="date"
          value={value.openingDate}
          onChange={(event) => onChange({ openingDate: event.target.value })}
          className="w-full max-w-80"
        />
      </FormBox.Row>

      <FormBox.Row label="사업자등록증 이미지" contentClassName="items-start py-3">
        <TruckImageUploadField
          fileIdList={value.fileIdList}
          photoFiles={value.photoFiles}
          photoPaths={value.photoPaths}
          onChange={(next) => onChange(next)}
          maxCount={5}
          accept="image/*"
          helperText="사업자등록증 이미지는 최대 5개까지 등록할 수 있습니다."
        />
      </FormBox.Row>

      {value.status || value.date || value.rejectionReason ? (
        <>
          <FormBox.Row label="서류 상태">
            <div className="text-fg-secondary text-sm">
              {value.status || "-"}
            </div>
          </FormBox.Row>
          <FormBox.Row label="처리 일자">
            <div className="text-fg-secondary text-sm">{value.date || "-"}</div>
          </FormBox.Row>
          {value.rejectionReason ? (
            <FormBox.Row label="반려 사유">
              <div className="text-fg-secondary text-sm">
                {value.rejectionReason}
              </div>
            </FormBox.Row>
          ) : null}
        </>
      ) : null}
    </FormBox>
  );
}

export default TruckDocumentSection;
