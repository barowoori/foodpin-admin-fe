import type { InputHTMLAttributes, ReactNode } from "react";

type LabelProps = {
  children: ReactNode;
  htmlFor?: string;
};

function Label({ children, htmlFor }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="font-pretendard tracking-brand text-ui-sm text-fg-secondary font-medium"
    >
      {children}
    </label>
  );
}

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className">;

function Input(props: InputProps) {
  return (
    <input
      className="font-pretendard border-border-control bg-bg-control text-ui-sm text-fg-primary placeholder:text-fg-muted focus:border-focus-ring focus:ring-focus-ring/30 h-11 max-w-40 rounded-lg border px-3 transition outline-none read-only:cursor-default focus:ring-2"
      {...props}
    />
  );
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-3">{children}</div>;
}

const InputWrapper = Object.assign(Wrapper, {
  Label,
  Input,
});

export default InputWrapper;
