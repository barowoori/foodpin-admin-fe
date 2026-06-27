import type { ApprovalStatus } from "./approval";

export type TruckTypeCode = "SNACK" | "MEAL" | "STREET_FOOD" | "COFFEE";
export type TruckBodyType = "WING_BODY" | "STANDARD" | "OTHER";
export type TruckColor =
  | "RED"
  | "ORANGE"
  | "YELLOW"
  | "LIGHT_GREEN"
  | "GREEN"
  | "SKY_BLUE"
  | "BLUE"
  | "MINT"
  | "NAVY"
  | "PURPLE"
  | "PINK"
  | "BROWN"
  | "BLACK"
  | "WHITE";
export type TruckPaymentMethod = "CASH" | "TRANSFER" | "CARD";
export type TruckProofIssuanceType = "CASH_RECEIPT" | "TAX_INVOICE";
export type TruckDocumentType = "BUSINESS_REGISTRATION";

export interface TruckPhoto {
  id: string;
  path: string;
}

export interface TruckRegion {
  code: string;
  name: string;
}

export interface TruckCategory {
  code: string;
  name: string;
}

export interface TruckMenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  photos: TruckPhoto[];
}

export interface TruckDocumentInfo {
  type: TruckDocumentType;
  date: string;
  status: ApprovalStatus;
  rejectionReason: string | null;
}

export interface TruckListItem {
  id: string;
  name: string;
  documents: string[];
  businessRegistrationApproved: boolean;
  regions: string[];
  regionList: string;
  menuNames: string[];
  photo: string | null;
  avgMenuPrice: number | null;
  menuPhotos: string[];
}

export interface TruckListResult {
  createAt: string;
  content: TruckListItem[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface TruckTableRow {
  no: number;
  id: string;
  name: string;
  regionList: string;
  avgMenuPrice: number | null;
  menuNames: string[];
  businessRegistrationApproved: boolean;
}

export interface TruckFilterState {
  search: string;
  regionDo: string;
  regionSi: string;
  category: string;
  type: "" | TruckTypeCode;
  bodyType: "" | TruckBodyType;
  page: number;
  size: number;
}

export type TruckFilterPatch = Partial<TruckFilterState>;

export interface TruckDetailData {
  isTruckManager: boolean;
  isAvailableUpdate: boolean;
  isAvailableDelete: boolean;
  truck: {
    id: string;
    name: string;
    description: string;
    electricityUsage: boolean;
    gasUsage: boolean;
    selfGenerationAvailability: boolean;
    photos: TruckPhoto[];
    truckColors: TruckColor[];
    bodyType: TruckBodyType;
    isCatering: boolean;
    types: TruckTypeCode[];
    paymentMethods: TruckPaymentMethod[];
    proofIssuanceTypes: TruckProofIssuanceType[];
  };
  documents: TruckDocumentType[];
  documentInfos: TruckDocumentInfo[];
  businessRegistrationApproved: boolean;
  regions: TruckRegion[];
  categories: TruckCategory[];
  menus: TruckMenuItem[];
  isLike: boolean;
  regionList: string;
}

export interface TruckOwnerFormState {
  ownerMemberId: string;
  ownerMemberNickname: string;
  ownerMemberPhone: string;
  ownerMemberEmail: string;
  ownerSocialLoginType: string;
  managerMemberIdsText: string;
}

export interface TruckBasicInfoFormState {
  name: string;
  description: string;
  fileIdList: string[];
  photoFiles: File[];
  photoPaths: string[];
  truckColors: TruckColor[];
  bodyType: "" | TruckBodyType;
}

export interface TruckOperationFormState {
  electricityUsage: boolean | null;
  gasUsage: boolean | null;
  selfGenerationAvailability: boolean | null;
  regionDo: string;
  regionSi: string;
  regions: TruckRegion[];
  isCatering: boolean | null;
}

export interface TruckMenuFormItem {
  localId: string;
  id?: string;
  name: string;
  description: string;
  price: string;
  fileIdList: string[];
  photoFiles: File[];
  photoPaths: string[];
}

export interface TruckMenuFormState {
  truckCategoryCodeSet: string[];
  types: TruckTypeCode[];
  truckMenuDtoList: TruckMenuFormItem[];
}

export interface TruckPaymentFormState {
  paymentMethods: TruckPaymentMethod[];
  proofIssuanceTypes: TruckProofIssuanceType[];
}

export interface TruckDocumentFormState {
  type: TruckDocumentType;
  businessNumber: string;
  businessName: string;
  representativeName: string;
  openingDate: string;
  fileIdList: string[];
  photoFiles: File[];
  photoPaths: string[];
  status: ApprovalStatus | "";
  date: string;
  rejectionReason: string;
}

export interface TruckFormStateBundle {
  ownerForm: TruckOwnerFormState;
  basicInfoForm: TruckBasicInfoFormState;
  operationForm: TruckOperationFormState;
  menuForm: TruckMenuFormState;
  paymentForm: TruckPaymentFormState;
  documentForm: TruckDocumentFormState;
}

export interface TruckBusinessRegistrationPayload {
  businessNumber: string;
  businessName: string;
  representativeName: string;
  openingDate: string;
}

export interface TruckCreateRequestBody {
  ownerMemberId: string;
  managerMemberIds: string[];
  createTruckDto: {
    truckInfoDto: {
      name: string;
      description: string;
      electricityUsage: boolean;
      gasUsage: boolean;
      selfGenerationAvailability: boolean;
      fileIdList: string[];
      truckColors: TruckColor[];
      bodyType: TruckBodyType;
      isCatering: boolean;
      types: TruckTypeCode[];
      paymentMethods: TruckPaymentMethod[];
      proofIssuanceTypes: TruckProofIssuanceType[];
    };
    truckRegionCodeSet: string[];
    truckCategoryCodeSet: string[];
    truckMenuDtoList: Array<{
      name: string;
      description: string;
      price: number;
      fileIdList: string[];
    }>;
    truckDocumentDtoSet: Array<{
      type: TruckDocumentType;
      createBusinessRegistrationDto?: TruckBusinessRegistrationPayload;
      fileIdList: string[];
    }>;
  };
}

export interface TruckUpdateRequestBody {
  truckInfoDto: {
    name: string;
    description: string;
    fileIdList: string[];
    truckColors: TruckColor[];
    bodyType: TruckBodyType;
  };
  truckOperationDto: {
    electricityUsage: boolean;
    gasUsage: boolean;
    selfGenerationAvailability: boolean;
    truckRegionCodeSet: string[];
    isCatering: boolean;
  };
  truckMenuDto: {
    truckCategoryCodeSet: string[];
    types: TruckTypeCode[];
    truckMenuDtoList: Array<{
      name: string;
      description: string;
      price: number;
      fileIdList: string[];
    }>;
  };
  truckPaymentDto: {
    paymentMethods: TruckPaymentMethod[];
    proofIssuanceTypes: TruckProofIssuanceType[];
  };
  truckDocumentDtoList: Array<{
    type: TruckDocumentType;
    createBusinessRegistrationDto?: TruckBusinessRegistrationPayload;
    fileIdList: string[];
  }>;
}

export interface TruckDocumentItem {
  truckId: string;
  documentType: string;
  nickname: string | null;
  phoneNumber?: string | null;
  phone?: string | null;
  businessRegistrationNumber: string;
  representativeName: string;
  businessName: string;
  openingDate: string;
  imageUrls: string[];
  status: ApprovalStatus;
  rejectionReason?: string | null;
  requestedAt: string;
  processedAt: string | null;
  documentId: string;
}

export type TruckDocumentTarget = Pick<
  TruckDocumentItem,
  "truckId" | "documentType"
>;

export type TruckDocumentRejectPayload = TruckDocumentTarget & {
  rejectionReason: string;
};
