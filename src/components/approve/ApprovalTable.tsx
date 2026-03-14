import { useState } from "react";
import ApprovalStatusSelect from "../ApprovalStatusSelect";
import type { ApprovalTableRow } from "../../types/approval";
import TableHeaderWrapper from "./table/TableHeaderWrapper";
import TableRow from "./table/TableRow";

const PAGE_SIZE_OPTIONS = [10, 20, 50];
const TABLE_GRID_CLASS =
  "grid w-full grid-cols-[32px_62px_86px_104px_74px_minmax(74px,1fr)_68px_84px_70px_74px_74px_80px] items-center gap-x-[13px] text-center text-[13px] leading-tight [&>span]:min-w-0 [&>span]:truncate [&>span:nth-child(6)]:overflow-visible [&>span:nth-child(6)]:text-clip [&>span:nth-child(6)]:whitespace-normal [&>span:nth-child(6)]:break-all [&>span:nth-child(10)]:overflow-visible [&>span:nth-child(10)]:text-clip [&>span:nth-child(10)]:whitespace-normal [&>span:nth-child(11)]:overflow-visible [&>span:nth-child(11)]:text-clip [&>span:nth-child(11)]:whitespace-normal";

type ApprovalTableProps = {
  items: ApprovalTableRow[];
  totalCount?: number;
};

function ApprovalTable({
  items,
  totalCount = items.length,
}: ApprovalTableProps) {
  const [pageSize, setPageSize] = useState(10);
  const pageSizeOptions = PAGE_SIZE_OPTIONS.map((option) => ({
    value: String(option),
    label: String(option),
  }));

  return (
    <section className="mt-16">
      <div className="font-pretendard text-fg-primary mb-3 flex items-center gap-2 text-[16px]">
        <span>총 {totalCount}건</span>
        <ApprovalStatusSelect
          value={String(pageSize)}
          onChange={(next) => setPageSize(Number(next))}
          options={pageSizeOptions}
          widthClassName="w-24"
        />
        <span>건씩 보기</span>
      </div>

      <div className="overflow-x-auto">
        <TableHeaderWrapper gridClassName={TABLE_GRID_CLASS}>
          <span>번호</span>
          <span>닉네임</span>
          <span>휴대폰번호</span>
          <span>사업자등록번호</span>
          <span>대표자 성명</span>
          <span>상호</span>
          <span>개업일자</span>
          <span>이미지</span>
          <span>승인상태</span>
          <span>요청일시</span>
          <span>처리일시</span>
          <span>관리</span>
        </TableHeaderWrapper>

        {items.map((row) => (
          <div
            key={`${row.truckId}-${row.no}`}
            className="border-border-control text-fg-primary border-b p-3.25"
          >
            <div className={TABLE_GRID_CLASS}>
              <TableRow item={row} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ApprovalTable;
