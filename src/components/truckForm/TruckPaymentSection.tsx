import { FormBox } from "../form";
import type {
  TruckPaymentFormState,
  TruckPaymentMethod,
  TruckProofIssuanceType,
} from "../../types";
import {
  TRUCK_PAYMENT_METHOD_OPTIONS,
  TRUCK_PROOF_ISSUANCE_OPTIONS,
  toggleListItem,
} from "../../features/truckForm/formModel";

type TruckPaymentSectionProps = {
  value: TruckPaymentFormState;
  onChange: (patch: Partial<TruckPaymentFormState>) => void;
};

const TOGGLE_BUTTON_BASE_CLASS =
  "border-border-control bg-bg-app text-fg-subtle hover:bg-bg-control hover:text-fg-secondary peer-checked:border-[#73879d] peer-checked:bg-[#50647a] peer-checked:text-[#f3f6fa] inline-flex h-11 cursor-pointer items-center justify-center rounded-md border text-[15px] font-semibold transition-colors";

function TruckPaymentSection({
  value,
  onChange,
}: TruckPaymentSectionProps) {
  return (
    <FormBox>
      <FormBox.Row label="결제방식" required contentClassName="py-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {TRUCK_PAYMENT_METHOD_OPTIONS.map((option) => (
            <label key={option.value} className="inline-flex">
              <input
                type="checkbox"
                checked={value.paymentMethods.includes(option.value)}
                onChange={() =>
                  onChange({
                    paymentMethods: toggleListItem<TruckPaymentMethod>(
                      value.paymentMethods,
                      option.value,
                    ),
                  })
                }
                className="peer sr-only"
              />
              <span className={`${TOGGLE_BUTTON_BASE_CLASS} min-w-24 px-4`}>
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </FormBox.Row>

      <FormBox.Row label="증빙발행" required contentClassName="py-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {TRUCK_PROOF_ISSUANCE_OPTIONS.map((option) => (
            <label key={option.value} className="inline-flex">
              <input
                type="checkbox"
                checked={value.proofIssuanceTypes.includes(option.value)}
                onChange={() =>
                  onChange({
                    proofIssuanceTypes: toggleListItem<TruckProofIssuanceType>(
                      value.proofIssuanceTypes,
                      option.value,
                    ),
                  })
                }
                className="peer sr-only"
              />
              <span className={`${TOGGLE_BUTTON_BASE_CLASS} min-w-32 px-4`}>
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </FormBox.Row>
    </FormBox>
  );
}

export default TruckPaymentSection;
