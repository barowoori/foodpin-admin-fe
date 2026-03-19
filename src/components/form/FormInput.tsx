import type { InputHTMLAttributes } from "react";

type FormInputProps = InputHTMLAttributes<HTMLInputElement>;

function FormInput({ className = "", ...props }: FormInputProps) {
  return (
    <input
      className={`font-pretendard border-border-control bg-bg-control text-ui-sm text-fg-primary placeholder:text-fg-muted focus:border-focus-ring focus:ring-focus-ring/30 h-11 rounded-lg border px-3 transition outline-none focus:ring-2 ${className}`.trim()}
      {...props}
    />
  );
}

export default FormInput;
