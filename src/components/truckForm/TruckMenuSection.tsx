import Button from "../Button";
import { FormBox, FormInput, FormTextArea } from "../form";
import type { TruckMenuFormItem, TruckMenuFormState, TruckTypeCode } from "../../types";
import {
  TRUCK_CATEGORY_OPTIONS,
  TRUCK_TYPE_OPTIONS,
  toggleListItem,
} from "../../features/truckForm/formModel";
import TruckImageUploadField from "./TruckImageUploadField";

type TruckMenuSectionProps = {
  value: TruckMenuFormState;
  onChange: (patch: Partial<TruckMenuFormState>) => void;
  onMenuItemChange: (localId: string, patch: Partial<TruckMenuFormItem>) => void;
  onAddMenuItem: () => void;
  onRemoveMenuItem: (localId: string) => void;
};

const TOGGLE_BUTTON_BASE_CLASS =
  "border-border-control bg-bg-app text-fg-subtle hover:bg-bg-control hover:text-fg-secondary peer-checked:border-[#73879d] peer-checked:bg-[#50647a] peer-checked:text-[#f3f6fa] inline-flex h-11 cursor-pointer items-center justify-center rounded-md border text-[15px] font-semibold transition-colors";

function TruckMenuSection({
  value,
  onChange,
  onMenuItemChange,
  onAddMenuItem,
  onRemoveMenuItem,
}: TruckMenuSectionProps) {
  return (
    <FormBox className="overflow-visible">
      <FormBox.Row label="푸드트럭 유형" required contentClassName="py-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {TRUCK_TYPE_OPTIONS.map((option) => (
            <label key={option.value} className="inline-flex">
              <input
                type="checkbox"
                checked={value.types.includes(option.value)}
                onChange={() =>
                  onChange({
                    types: toggleListItem<TruckTypeCode>(value.types, option.value),
                  })
                }
                className="peer sr-only"
              />
              <span className={`${TOGGLE_BUTTON_BASE_CLASS} min-w-20 px-5`}>
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </FormBox.Row>

      <FormBox.Row label="메뉴 카테고리" required contentClassName="py-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {TRUCK_CATEGORY_OPTIONS.map((option) => (
            <label key={option.value} className="inline-flex">
              <input
                type="checkbox"
                checked={value.truckCategoryCodeSet.includes(option.value)}
                onChange={() =>
                  onChange({
                    truckCategoryCodeSet: toggleListItem<string>(
                      value.truckCategoryCodeSet,
                      option.value,
                    ),
                  })
                }
                className="peer sr-only"
              />
              <span className={`${TOGGLE_BUTTON_BASE_CLASS} min-w-16 px-4`}>
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </FormBox.Row>

      <FormBox.Row label="메뉴 목록" required contentClassName="items-start py-4">
        <div className="flex w-full flex-col gap-6">
          {value.truckMenuDtoList.map((menu, index) => (
            <div
              key={menu.localId}
              className="border-border-control/70 rounded-xl border p-4"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-fg-secondary text-sm font-semibold">
                  메뉴 {index + 1}
                </h3>
                <Button
                  onClick={() => onRemoveMenuItem(menu.localId)}
                  className="min-w-20 rounded-sm border-[#cfcfcf] bg-[#efefef] text-[#666666] hover:bg-[#e2e2e2]"
                >
                  삭제
                </Button>
              </div>

              <div className="grid gap-4">
                <TruckImageUploadField
                  fileIdList={menu.fileIdList}
                  photoFiles={menu.photoFiles}
                  photoPaths={menu.photoPaths}
                  onChange={(next) => onMenuItemChange(menu.localId, next)}
                  maxCount={5}
                  helperText="메뉴 사진은 최대 5개까지 등록할 수 있습니다."
                />

                <FormInput
                  value={menu.name}
                  onChange={(event) =>
                    onMenuItemChange(menu.localId, { name: event.target.value })
                  }
                  placeholder="메뉴명을 입력하세요"
                  className="w-full max-w-120"
                />

                <FormInput
                  value={menu.price}
                  onChange={(event) =>
                    onMenuItemChange(menu.localId, {
                      price: event.target.value.replace(/[^\d]/g, ""),
                    })
                  }
                  placeholder="가격을 입력하세요"
                  inputMode="numeric"
                  className="w-full max-w-80"
                />

                <FormTextArea
                  value={menu.description}
                  onChange={(event) =>
                    onMenuItemChange(menu.localId, {
                      description: event.target.value,
                    })
                  }
                  placeholder="메뉴 설명을 입력하세요"
                  className="min-h-24 max-w-160"
                />
              </div>
            </div>
          ))}

          <div>
            <Button
              onClick={onAddMenuItem}
              className="rounded-sm border-[#cfcfcf] bg-[#efefef] text-[#666666] hover:bg-[#e2e2e2]"
            >
              메뉴 추가
            </Button>
          </div>
        </div>
      </FormBox.Row>
    </FormBox>
  );
}

export default TruckMenuSection;
