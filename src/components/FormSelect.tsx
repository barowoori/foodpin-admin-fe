import ArrowIcon from "../assets/arrow.svg?react";

type FormSelectOption = {
  value: string;
  label: string;
};

const DEFAULT_OPTIONS: FormSelectOption[] = [
  { value: "", label: "--" },
  { value: "PENDING", label: "승인대기" },
  { value: "APPROVED", label: "승인" },
  { value: "REJECTED", label: "반려" },
];

type FormSelectProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options?: FormSelectOption[];
  widthClassName?: string;
  variant?: "dark" | "light";
  className?: string;
};

function FormSelect({
  id,
  value,
  onChange,
  options = DEFAULT_OPTIONS,
  widthClassName = "w-28",
  variant = "dark",
  className = "",
}: FormSelectProps) {
  const variantClassName =
    variant === "light"
      ? "h-11 cursor-pointer appearance-none rounded-sm border border-[#cfcfcf] bg-[#f3f3f3] px-3 pr-8 text-[16px] tracking-[-0.01em] text-[#666666] outline-none transition focus:border-[#b8b8b8]"
      : "border-border-control bg-bg-control text-ui-sm text-fg-primary focus:border-focus-ring focus:ring-focus-ring/30 h-11 cursor-pointer appearance-none rounded-lg border px-3 pr-7 transition outline-none focus:ring-2";

  const iconClassName =
    variant === "light" ? "text-[#999999]" : "text-icon-primary";

  return (
    <div className="relative w-fit">
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`font-pretendard ${variantClassName} ${widthClassName} ${className}`.trim()}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ArrowIcon
        className={`${iconClassName} pointer-events-none absolute top-1/2 right-2.5 h-3 w-3 -translate-y-1/2`}
      />
    </div>
  );
}

export type { FormSelectOption };
export default FormSelect;
