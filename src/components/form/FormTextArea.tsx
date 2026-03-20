import type { TextareaHTMLAttributes } from "react";

type FormTextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

function FormTextArea({ className = "", ...props }: FormTextAreaProps) {
  return (
    <textarea
      className={`font-pretendard border-border-control bg-bg-control text-ui-sm text-fg-primary placeholder:text-fg-muted focus:border-focus-ring focus:ring-focus-ring/30 min-h-24 w-full resize-y rounded-lg border px-3 py-2 transition outline-none focus:ring-2 ${className}`.trim()}
      {...props}
    />
  );
}

export default FormTextArea;
