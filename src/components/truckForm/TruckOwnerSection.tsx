import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchMembers } from "../../apis";
import { Button, Pagination } from "../../components";
import type { MemberSearchItem, TruckOwnerFormState } from "../../types";
import { FormBox, FormInput, FormTextArea } from "../form";

type TruckOwnerSectionProps = {
  value: TruckOwnerFormState;
  onChange: (patch: Partial<TruckOwnerFormState>) => void;
};

const MEMBER_SEARCH_PAGE_SIZE = 10;
const MEMBER_SEARCH_MIN_LENGTH = 2;
const MEMBER_SEARCH_DEBOUNCE_MS = 350;

function TruckOwnerSection({ value, onChange }: TruckOwnerSectionProps) {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [page, setPage] = useState(0);

  const trimmedSearchKeyword = useMemo(
    () => searchKeyword.trim(),
    [searchKeyword],
  );
  const hasTypedKeyword = trimmedSearchKeyword.length > 0;
  const canSearch = trimmedSearchKeyword.length >= MEMBER_SEARCH_MIN_LENGTH;
  const shouldShowDropdown = hasTypedKeyword;

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedKeyword(trimmedSearchKeyword);
      setPage(0);
    }, MEMBER_SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [trimmedSearchKeyword]);

  const { data, isFetching, isError } = useQuery({
    queryKey: ["member-owner-search", debouncedKeyword, page],
    queryFn: () =>
      searchMembers({
        search: debouncedKeyword,
        page,
        size: MEMBER_SEARCH_PAGE_SIZE,
        sort: ["createdAt,DESC"],
      }),
    enabled: debouncedKeyword.length >= MEMBER_SEARCH_MIN_LENGTH,
  });

  const handleSelectOwner = (member: MemberSearchItem) => {
    onChange({
      ownerMemberId: member.memberId,
      ownerMemberNickname: member.nickname ?? "",
      ownerMemberPhone: member.phone ?? "",
      ownerMemberEmail: member.email ?? "",
      ownerSocialLoginType: member.socialLoginType ?? "",
    });
  };

  const handleClearOwner = () => {
    onChange({
      ownerMemberId: "",
      ownerMemberNickname: "",
      ownerMemberPhone: "",
      ownerMemberEmail: "",
      ownerSocialLoginType: "",
    });
  };

  return (
    <FormBox allowOverflow>
      <FormBox.Row label="소유자 회원 ID" required>
        <div className="flex w-full flex-col gap-3">
          <FormInput
            value={value.ownerMemberId}
            readOnly
            placeholder="아래 검색 결과에서 소유자 회원을 선택해주세요"
            className="w-full max-w-120 cursor-default"
          />

          {value.ownerMemberId ? (
            <div className="border-border-control/70 bg-bg-app/60 flex w-full max-w-160 flex-col gap-2 rounded-lg border px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-fg-secondary text-sm font-semibold">
                  선택된 회원
                </span>
                <span className="text-fg-primary text-sm">
                  {value.ownerMemberId}
                </span>
                <Button
                  className="h-8 min-w-20 text-xs"
                  onClick={handleClearOwner}
                >
                  선택 해제
                </Button>
              </div>
              <div className="text-fg-muted flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <span>닉네임: {value.ownerMemberNickname || "-"}</span>
                <span>전화번호: {value.ownerMemberPhone || "-"}</span>
                <span>이메일: {value.ownerMemberEmail || "-"}</span>
                <span>로그인: {value.ownerSocialLoginType || "-"}</span>
              </div>
            </div>
          ) : null}

          <div className="relative z-20 w-full max-w-160">
            <div className="flex flex-col gap-2">
              <FormInput
                type="search"
                value={searchKeyword}
                onChange={(event) => setSearchKeyword(event.target.value)}
                placeholder="닉네임 또는 전화번호로 회원 검색"
                className="w-full"
              />
            </div>

            {shouldShowDropdown ? (
              <div className="border-border-control/70 bg-bg-control absolute top-full right-0 left-0 z-30 mt-2 overflow-hidden rounded-lg border shadow-[0_16px_32px_rgba(0,0,0,0.38)]">
                {!canSearch ? (
                  <div className="text-fg-muted px-4 py-4 text-sm">
                    2자 이상 입력하면 회원을 조회합니다.
                  </div>
                ) : (
                  <>
                    <div className="bg-bg-app/80 flex items-center justify-between px-4 py-3">
                      <div className="text-sm">
                        <span className="text-fg-secondary">검색어</span>
                        <span className="text-fg-primary ml-2 font-semibold">
                          {trimmedSearchKeyword}
                        </span>
                      </div>
                      <span className="text-fg-muted text-sm">
                        총 {data?.totalElements ?? 0}건
                      </span>
                    </div>

                    <div className="member-search-scrollbar divide-border-control/70 max-h-90 divide-y overflow-y-auto">
                      {isError ? (
                        <div className="text-fg-muted px-4 py-6 text-sm">
                          회원 조회에 실패했습니다. 잠시 후 다시 시도해주세요.
                        </div>
                      ) : null}

                      {isFetching ? (
                        <div className="text-fg-muted px-4 py-6 text-sm">
                          회원 목록을 불러오는 중입니다.
                        </div>
                      ) : null}

                      {!isFetching &&
                      !isError &&
                      (data?.content.length ?? 0) === 0 ? (
                        <div className="text-fg-muted px-4 py-6 text-sm">
                          검색 결과가 없습니다.
                        </div>
                      ) : null}

                      {!isFetching &&
                        !isError &&
                        data?.content.map((member) => {
                          const isSelected =
                            member.memberId === value.ownerMemberId;

                          return (
                            <div
                              key={member.memberId}
                              className="flex flex-col gap-3 px-4 py-4 lg:flex-row lg:items-center lg:justify-between"
                            >
                              <div className="flex flex-col gap-1 text-sm">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-fg-primary font-semibold">
                                    {member.nickname || "-"}
                                  </span>
                                  <span className="text-fg-muted">
                                    {member.memberId}
                                  </span>
                                </div>
                                <div className="text-fg-muted flex flex-wrap gap-x-4 gap-y-1">
                                  <span>전화번호: {member.phone || "-"}</span>
                                  <span>이메일: {member.email || "-"}</span>
                                  <span>
                                    로그인: {member.socialLoginType || "-"}
                                  </span>
                                </div>
                              </div>

                              <Button
                                onClick={() => handleSelectOwner(member)}
                                className={
                                  isSelected
                                    ? "border-[#6f8198] bg-[#5f738a] text-white hover:bg-[#6b819b]"
                                    : ""
                                }
                              >
                                {isSelected ? "선택됨" : "선택"}
                              </Button>
                            </div>
                          );
                        })}
                    </div>

                    {(data?.totalPages ?? 0) > 1 ? (
                      <div className="border-border-control/70 bg-bg-app/40 border-t px-4 py-4">
                        <Pagination
                          totalPages={data?.totalPages ?? 0}
                          currentPage={data?.page ?? page}
                          onPageChange={setPage}
                          disabled={isFetching}
                        />
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </FormBox.Row>

      <FormBox.Row label="관리자 회원 ID">
        <div className="w-full max-w-160">
          <FormTextArea
            value={value.managerMemberIdsText}
            onChange={(event) =>
              onChange({ managerMemberIdsText: event.target.value })
            }
            placeholder="쉼표(,) 또는 줄바꿈으로 여러 관리자 ID를 입력하세요"
            className="min-h-24"
          />
          <p className="text-fg-muted mt-2 text-xs">
            예: member-id-1, member-id-2
          </p>
        </div>
      </FormBox.Row>
    </FormBox>
  );
}

export default TruckOwnerSection;
