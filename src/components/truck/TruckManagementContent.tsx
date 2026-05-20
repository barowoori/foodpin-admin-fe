import type { TruckFilterPatch, TruckFilterState, TruckTableRow } from "../../types";
import type { RegionSelectOption, TruckFilterSelectOption } from "../../utils";
import TruckSearchField from "./TruckSearchField";
import TruckTable from "./TruckTable";

type TruckManagementContentProps = {
  filters: TruckFilterState;
  regionDoOptions: RegionSelectOption[];
  regionSiOptions: RegionSelectOption[];
  categoryOptions: TruckFilterSelectOption[];
  typeOptions: TruckFilterSelectOption[];
  bodyTypeOptions: TruckFilterSelectOption[];
  onFilterPatch: (patch: TruckFilterPatch) => void;
  items: TruckTableRow[];
  totalCount: number;
  pageSize: number;
  totalPages: number;
  currentPage: number;
  onPageSizeChange: (nextSize: number) => void;
  onPageChange: (nextPage: number) => void;
  isFetching?: boolean;
};

function TruckManagementContent({
  filters,
  regionDoOptions,
  regionSiOptions,
  categoryOptions,
  typeOptions,
  bodyTypeOptions,
  onFilterPatch,
  items,
  totalCount,
  pageSize,
  totalPages,
  currentPage,
  onPageSizeChange,
  onPageChange,
  isFetching = false,
}: TruckManagementContentProps) {
  return (
    <>
      <TruckSearchField
        value={filters}
        regionDoOptions={regionDoOptions}
        regionSiOptions={regionSiOptions}
        categoryOptions={categoryOptions}
        typeOptions={typeOptions}
        bodyTypeOptions={bodyTypeOptions}
        onChange={onFilterPatch}
      />

      <TruckTable
        items={items}
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

export default TruckManagementContent;
