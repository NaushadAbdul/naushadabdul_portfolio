import fs from "node:fs";
import path from "node:path";

const PHOTO = "portrait.jpg";
const PLACEHOLDER = "portrait-placeholder.svg";

/**
 * Resolves the hero portrait at build (or revalidate) time.
 *
 * Checking the filesystem here rather than letting the <img> 404 and recover in
 * the browser keeps the fallback deterministic, avoids a wasted round trip and
 * keeps a server-side error out of the logs.
 *
 * Drop your photo at `public/portrait.jpg` and it is picked up automatically.
 */
export function resolvePortraitSrc(): string {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", PHOTO)) ? `/${PHOTO}` : `/${PLACEHOLDER}`;
  } catch {
    return `/${PLACEHOLDER}`;
  }
}
