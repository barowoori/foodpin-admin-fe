import { createPortal } from "react-dom";
import { useEffect, type ReactNode } from "react";
import Button from "../components/Button";

interface ModalProps {
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
}

interface ModalMainProps extends ModalProps {
  open?: boolean;
  closeOnBackdrop?: boolean;
}

function ModalHeader({ children, className = "" }: ModalProps) {
  return (
    <div
      className={`flex items-center justify-between pt-5 pb-3 text-[16px] font-semibold text-[#222] ${className}`}
    >
      <div>{children}</div>
    </div>
  );
}

function ModalDescription({ children, className = "" }: ModalProps) {
  return (
    <div
      className={`mt-3 px-6 text-[14px] leading-6 whitespace-pre-line text-[#555] ${className}`}
    >
      {children}
    </div>
  );
}

function ModalButtonLayout({ children, className = "" }: ModalProps) {
  return (
    <div
      className={`mt-5 flex flex-row items-center justify-center gap-3 px-6 pb-5 ${className}`}
    >
      {children}
    </div>
  );
}

function ModalCancled({ children, onClick }: ModalProps) {
  return <Button onClick={onClick}>{children}</Button>;
}

function ModalMain({
  children,
  onClick,
  open = true,
  closeOnBackdrop = true,
  className = "",
}: ModalMainProps) {
  useEffect(() => {
    if (!open || !onClick) {
      return;
    }

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClick();
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClick]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/60">
      <div
        className="flex min-h-full items-center justify-center p-4"
        onClick={closeOnBackdrop ? onClick : undefined}
      >
        <div
          className={`border-border-control bg-bg-control text-fg-primary flex w-full max-w-130 flex-col items-center overflow-hidden rounded-md border px-6 py-7 shadow-[0_18px_40px_rgba(0,0,0,0.45)] [&>img]:mx-auto [&>img]:block [&>img]:h-auto [&>img]:max-w-full ${className}`}
          onClick={(event) => event.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}

const Modal = Object.assign(ModalMain, {
  Header: ModalHeader,
  Description: ModalDescription,
  ButtonLayout: ModalButtonLayout,
  Cancled: ModalCancled,
});

export default Modal;
