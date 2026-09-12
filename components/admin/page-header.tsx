import type { ReactNode } from "react";
import type { Accent } from "@/lib/types";
import { accentStyle, cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  description?: string;
  accent?: Accent;
  /** Rendered on the right, typically a primary action button. */
  action?: ReactNode;
};

export function PageHeader({ title, description, accent = "yellow", action }: PageHeaderProps) {
  return (
    <header className="mb-7 border-b-[3px] border-ink pb-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span
            aria-hidden="true"
            className={cn("mb-3 block h-2.5 w-16 border-2 border-ink", accentStyle(accent).bg)}
          />
          <h1 className="text-3xl uppercase md:text-4xl">{title}</h1>
          {description ? (
            <p className="mt-2 max-w-2xl font-mono text-[0.7rem] leading-relaxed tracking-wide text-ink/60">
              {description}
            </p>
          ) : null}
        </div>

        {action ? <div className="flex flex-wrap gap-3">{action}</div> : null}
      </div>
    </header>
  );
}
