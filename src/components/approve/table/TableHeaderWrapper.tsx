import type { ReactNode } from "react";

type TableHeaderWrapperProps = {
  children: ReactNode;
  gridClassName: string;
};

function TableHeaderWrapper({
  children,
  gridClassName,
}: TableHeaderWrapperProps) {
  return (
    <div className="border-border-control bg-bg-control text-fg-primary border-y p-3.25 text-[13px]">
      <div className={gridClassName}>{children}</div>
    </div>
  );
}

export default TableHeaderWrapper;
