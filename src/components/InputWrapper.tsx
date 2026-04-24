import type { InputHTMLAttributes, ReactNode } from "react";

type LabelProps = {
  children: ReactNode;
  htmlFor?: string;
};

function Label({ children, htmlFor }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="font-pretendard tracking-brand text-fg-secondary text-[16px] font-medium"
    >
      {children}
    </label>
  );
}

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className">;

function Input(props: InputProps) {
  return (
    <input
      className="font-pretendard border-border-control bg-bg-control text-ui-sm text-fg-primary placeholder:text-fg-muted focus:border-focus-ring focus:ring-focus-ring/30 h-11 w-full max-w-40 rounded-lg border px-3 transition outline-none read-only:cursor-default focus:ring-2 sm:w-auto"
      {...props}
    />
  );
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col items-start gap-2 lg:w-auto lg:flex-row lg:items-center lg:gap-3">
      {children}
    </div>
  );
}

const InputWrapper = Object.assign(Wrapper, {
  Label,
  Input,
});

export default InputWrapper;
