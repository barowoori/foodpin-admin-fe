export type MemberSocialLoginType = "KAKAO" | string;

export interface MemberSearchItem {
  memberId: string;
  nickname: string | null;
  phone: string | null;
  email: string | null;
  socialLoginType: MemberSocialLoginType | null;
}

export interface MemberSearchResult {
  createAt: string;
  content: MemberSearchItem[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  first: boolean;
  last: boolean;
}
