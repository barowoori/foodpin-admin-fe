function Button({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="font-pretendard border-border-control bg-bg-control text-fg-primary focus-visible:ring-focus-ring/40 inline-flex h-10 min-w-24 cursor-pointer items-center justify-center rounded-lg border px-4 text-sm font-semibold transition-colors duration-150 hover:bg-[#3a3f47] focus-visible:ring-2 focus-visible:outline-none active:bg-[#333840] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
}

export default Button;
