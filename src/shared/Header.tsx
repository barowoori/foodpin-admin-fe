import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { getInfo, type MemberInfo } from "../apis";
import { useAuthStore } from "../stores";

function Header() {
  const navigate = useNavigate();
  const clearTokens = useAuthStore((state) => state.clearTokens);
  const [info, setInfo] = useState<MemberInfo | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const nickname = info?.nickname ?? "Admin";
  const fallbackInitial = nickname.slice(0, 1);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await getInfo();
        setInfo(res);
      } catch (error) {
        console.error("Failed to fetch member info", error);
      }
    };

    fetchInfo();
  }, []);

  const handleLogout = () => {
    setIsMenuOpen(false);
    clearTokens();
    navigate("/login", { replace: true });
  };

  return (
    <header className="border-border-control/70 bg-bg-control/90 text-fg-primary sticky top-0 z-20 w-full border-b backdrop-blur">
      <div className="mx-auto flex w-full max-w-270 flex-col gap-3 px-2 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-start sm:gap-8">
          <span
            className="font-pretendard tracking-brand text-ui-base cursor-pointer leading-none font-semibold whitespace-nowrap"
            onClick={() => navigate("/business")}
          >
            Foodpin Admin
          </span>

          <div className="hidden items-center gap-2 sm:flex">
            <Link
              to="/business"
              className="text-fg-secondary hover:text-fg-primary hover:bg-bg-app rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors"
            >
              사업자등록 관리
            </Link>
            <Link
              to="/events"
              className="text-fg-secondary hover:text-fg-primary hover:bg-bg-app rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors"
            >
              행사 관리
            </Link>
          </div>
        </div>

        <div
          className="relative"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <button
            type="button"
            className="bg-bg-app/65 border-border-control flex cursor-pointer items-center gap-3 rounded-full border px-2.5 py-1.5 whitespace-nowrap"
          >
            {info?.image ? (
              <img
                src={info.image}
                alt={nickname}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="bg-fg-primary/20 text-fg-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold">
                {fallbackInitial}
              </div>
            )}
            <div className="flex flex-col pr-1">
              <span className="text-ui-sm leading-tight font-semibold">
                {nickname}
              </span>
            </div>
          </button>

          <div
            className={`border-border-control bg-bg-control absolute left-[50%] mt-1 min-w-28 -translate-x-1/2 rounded-lg border p-1 shadow-lg transition-all duration-200 ${
              isMenuOpen
                ? "visible translate-y-0 opacity-100"
                : "pointer-events-none invisible -translate-y-1 opacity-0"
            }`}
          >
            <button
              type="button"
              onClick={handleLogout}
              className="hover:bg-bg-app w-full cursor-pointer rounded-md px-3 py-2 text-left text-sm text-red-500"
            >
              로그아웃
            </button>
          </div>
        </div>

        <div className="flex w-full items-center gap-2 sm:hidden">
          <Link
            to="/business"
            className="text-fg-secondary hover:text-fg-primary hover:bg-bg-app rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors"
          >
            사업자등록 관리
          </Link>
          <Link
            to="/events"
            className="text-fg-secondary hover:text-fg-primary hover:bg-bg-app rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors"
          >
            행사 관리
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
