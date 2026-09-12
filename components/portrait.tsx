import Image from "next/image";
import { resolvePortraitSrc } from "@/lib/portrait";
import { cn } from "@/lib/utils";

type PortraitProps = {
  alt: string;
  /** Storage URL from `site_settings.portrait_url`. Falls back to disk. */
  src?: string | null;
  className?: string;
};

/**
 * Hero portrait.
 *
 * The source resolves on the server, so a missing image renders the designed
 * placeholder poster instead — no client JavaScript and no failed request.
 *
 * Remote images bypass the optimiser (they would otherwise need every possible
 * host allow-listed in next.config), while local files are still optimised.
 */
export function Portrait({ alt, src, className }: PortraitProps) {
  const resolved = src?.trim() || resolvePortraitSrc();
  const isLocal = resolved.startsWith("/");

  return (
    <Image
      src={resolved}
      alt={alt}
      width={520}
      height={640}
      priority
      unoptimized={!isLocal || resolved.endsWith(".svg")}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}
