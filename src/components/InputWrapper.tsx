import type { InputHTMLAttributes, ReactNode } from "react";

type LabelProps = {
  children: ReactNode;
  htmlFor?: string;
};

function Label({ children, htmlFor }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="font-pretendard tracking-brand text-sm font-medium text-[#f1f1f1]"
    >
      {children}
    </label>
  );
}

function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`font-pretendard h-11 rounded-lg border border-[#5a5a5a] bg-[#2b2b2b] px-3 text-sm text-[#fafafa] transition outline-none placeholder:text-[#a0a0a0] focus:border-[#6f8198] focus:ring-2 focus:ring-[#6f8198]/30 ${className}`}
      {...props}
    />
  );
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-5">{children}</div>;
}

const InputWrapper = Object.assign(Wrapper, {
  Label,
  Input,
});

export default InputWrapper;
