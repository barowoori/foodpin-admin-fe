import type { ReactNode } from "react";

type FormBoxProps = {
  children: ReactNode;
  className?: string;
};

type FormBoxRowProps = {
  label: ReactNode;
  required?: boolean;
  children: ReactNode;
  className?: string;
  labelClassName?: string;
  contentClassName?: string;
};

function FormBoxRoot({ children, className = "" }: FormBoxProps) {
  return (
    <section
      className={`border-border-control/80 bg-bg-control overflow-hidden rounded-xl border shadow-[0_8px_24px_rgba(0,0,0,0.28)] ${className}`.trim()}
    >
      {children}
    </section>
  );
}

function FormBoxRow({
  label,
  required = false,
  children,
  className = "",
  labelClassName = "",
  contentClassName = "",
}: FormBoxRowProps) {
  return (
    <div
      className={`border-border-control/70 flex min-h-14 flex-col border-b last:border-b-0 sm:flex-row ${className}`.trim()}
    >
      <div
        className={`bg-bg-app text-fg-secondary tracking-brand flex w-full items-center border-b border-white/10 px-4 py-2.5 text-[16px] font-semibold sm:w-42.5 sm:shrink-0 sm:border-b-0 sm:py-0 ${labelClassName}`.trim()}
      >
        <span>{label}</span>
        {required ? <span className="ml-0.5 text-[#ff3b30]">*</span> : null}
      </div>
      <div
        className={`flex w-full flex-1 items-center px-4 py-2.5 sm:py-2 ${contentClassName}`.trim()}
      >
        {children}
      </div>
    </div>
  );
}

const FormBox = Object.assign(FormBoxRoot, {
  Row: FormBoxRow,
});

export default FormBox;
