import EventDateField from "./EventDateField";
import EventSearchField from "./EventSearchField";
import EventTable from "./EventTable";
import type {
  EventFilterPatch,
  EventFilterState,
  EventTableRow,
} from "../../types";
import type { RegionSelectOption } from "../../utils";

type EventManagementContentProps = {
  filters: EventFilterState;
  regionDoOptions: RegionSelectOption[];
  regionSiOptions: RegionSelectOption[];
  onFilterPatch: (patch: EventFilterPatch) => void;
  onToggleEventHidden: (
    eventId: string,
    nextIsHidden: boolean,
  ) => Promise<void>;
  items: EventTableRow[];
  totalCount: number;
  pageSize: number;
  totalPages: number;
  currentPage: number;
  onPageSizeChange: (nextSize: number) => void;
  onPageChange: (nextPage: number) => void;
  isFetching?: boolean;
};

function EventManagementContent({
  filters,
  regionDoOptions,
  regionSiOptions,
  onFilterPatch,
  onToggleEventHidden,
  items,
  totalCount,
  pageSize,
  totalPages,
  currentPage,
  onPageSizeChange,
  onPageChange,
  isFetching = false,
}: EventManagementContentProps) {
  return (
    <>
      <div className="">
        <EventSearchField
          value={filters}
          regionDoOptions={regionDoOptions}
          regionSiOptions={regionSiOptions}
          onChange={onFilterPatch}
        />

        <EventDateField value={filters} onChange={onFilterPatch} />
      </div>

      <EventTable
        items={items}
        onToggleEventHidden={onToggleEventHidden}
        totalCount={totalCount}
        pageSize={pageSize}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageSizeChange={onPageSizeChange}
        onPageChange={onPageChange}
        isFetching={isFetching}
      />
    </>
  );
}

export default EventManagementContent;
