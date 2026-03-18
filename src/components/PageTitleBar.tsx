import type { ReactNode } from "react";

type PageTitleBarProps = {
  title: string;
  actions?: ReactNode;
  className?: string;
};

function PageTitleBar({ title, actions, className = "" }: PageTitleBarProps) {
  return (
    <div
      className={`mb-10 flex items-start justify-between ${className}`.trim()}
    >
      <h1 className="font-pretendard tracking-brand text-fg-primary text-[24px] font-semibold">
        {title}
      </h1>
      {actions ? <div className="flex gap-3">{actions}</div> : null}
    </div>
  );
}

export default PageTitleBar;
