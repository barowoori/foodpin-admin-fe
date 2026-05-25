import type { TruckBackofficeListParams } from "../apis";
import type {
  TruckBodyType,
  TruckFilterState,
  TruckListResult,
  TruckTableRow,
  TruckTypeCode,
} from "../types";

export type TruckFilterSelectOption = {
  value: string;
  label: string;
};

export const TRUCK_TYPE_OPTIONS: TruckFilterSelectOption[] = [
  { value: "", label: "전체" },
  { value: "SNACK", label: "간식차" },
  { value: "MEAL", label: "식사차" },
  { value: "STREET_FOOD", label: "분식차" },
  { value: "COFFEE", label: "커피차" },
];

export const TRUCK_CATEGORY_OPTIONS: TruckFilterSelectOption[] = [
  { value: "", label: "전체" },
  { value: "C01", label: "한식" },
  { value: "C02", label: "양식" },
  { value: "C03", label: "일식" },
  { value: "C04", label: "중식" },
  { value: "C05", label: "분식" },
  { value: "C06", label: "세계음식" },
  { value: "C07", label: "기타" },
];

export const TRUCK_BODY_TYPE_OPTIONS: TruckFilterSelectOption[] = [
  { value: "", label: "전체" },
  { value: "WING_BODY", label: "윙바디" },
  { value: "STANDARD", label: "표준형" },
  { value: "OTHER", label: "기타" },
];

export const INITIAL_TRUCK_FILTERS: TruckFilterState = {
  search: "",
  regionDo: "",
  regionSi: "",
  category: "",
  type: "",
  bodyType: "",
  page: 0,
  size: 10,
};

export function buildTruckQueryParams(
  filters: TruckFilterState,
): TruckBackofficeListParams {
  const selectedRegionCode = filters.regionSi || filters.regionDo;

  return {
    search: filters.search.trim() || undefined,
    region: selectedRegionCode ? [selectedRegionCode] : undefined,
    category: filters.category ? [filters.category] : undefined,
    types: filters.type ? [filters.type as TruckTypeCode] : undefined,
    bodyTypes: filters.bodyType
      ? [filters.bodyType as TruckBodyType]
      : undefined,
    page: filters.page,
    size: filters.size,
    sort: ["createdAt,DESC"],
  };
}

export function mapTruckTableRows(
  data: TruckListResult | undefined,
  page: number,
  size: number,
): TruckTableRow[] {
  const resolvedPage = data?.page ?? page;
  const resolvedSize = data?.size ?? size;

  return (data?.content ?? []).map((item, index) => ({
    no: resolvedPage * resolvedSize + index + 1,
    id: item.id,
    name: item.name ?? "-",
    regionList: item.regionList?.trim() || "-",
    avgMenuPrice: item.avgMenuPrice,
    menuNames: item.menuNames ?? [],
    businessRegistrationApproved: item.businessRegistrationApproved,
  }));
}
