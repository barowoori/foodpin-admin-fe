import type { ReactNode } from "react";

type PageTitleBarProps = {
  title: string;
  actions?: ReactNode;
  className?: string;
};

function PageTitleBar({ title, actions, className = "" }: PageTitleBarProps) {
  return (
    <div
      className={`mb-8 flex flex-col items-start gap-3 lg:flex-row lg:items-start lg:justify-between ${className}`.trim()}
    >
      <h1 className="font-pretendard tracking-brand text-fg-primary text-[20px] font-semibold">
        {title}
      </h1>
      {actions ? (
        <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto lg:justify-end lg:gap-3">
          {actions}
        </div>
      ) : null}
    </div>
  );
}

export default PageTitleBar;
