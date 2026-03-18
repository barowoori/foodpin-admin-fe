import ApprovalStatusSelect from "./ApprovalStatusSelect";

const PAGE_SIZE_OPTIONS = [10, 20, 50];

type TableCountControlProps = {
  totalCount: number;
  pageSize: number;
  onPageSizeChange: (nextSize: number) => void;
  className?: string;
};

function TableCountControl({
  totalCount,
  pageSize,
  onPageSizeChange,
  className = "",
}: TableCountControlProps) {
  const pageSizeOptions = PAGE_SIZE_OPTIONS.map((option) => ({
    value: String(option),
    label: String(option),
  }));

  return (
    <div
      className={`font-pretendard text-fg-primary flex items-center gap-2 text-[16px] ${className}`.trim()}
    >
      <span>총 {totalCount}건</span>
      <ApprovalStatusSelect
        value={String(pageSize)}
        onChange={(next) => onPageSizeChange(Number(next))}
        options={pageSizeOptions}
        widthClassName="w-24"
      />
      <span>건씩 보기</span>
    </div>
  );
}

export default TableCountControl;
