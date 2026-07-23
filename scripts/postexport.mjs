// Post-processes the static export in out/ for GitHub Pages:
//   1. Writes .nojekyll so paths beginning with an underscore (_next, and
//      anything else) are served instead of being run through Jekyll.
//   2. Drops the ungraded masters. public/images/_originals/ is the source
//      the grade script reads from and stays in the repo, but no visitor ever
//      requests it, so it is removed from the published output.

import { rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const out = path.join(process.cwd(), "out");

writeFileSync(path.join(out, ".nojekyll"), "");
rmSync(path.join(out, "images", "_originals"), { recursive: true, force: true });
