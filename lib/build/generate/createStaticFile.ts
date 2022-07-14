import React from "react";
import ReactDOMServer from "react-dom/server";
import fs from "fs-extra";
import path, { join } from "path";

import { generateClientBundle } from "../bundle/client";
import { getPageName } from "../../utils/page";

export async function createStaticFile(
  Component: React.Element,
  filePath: string,
  options?: {
    outdir?: string;
    fileName?: string;
  }
) {
  const pageName = getPageName(filePath);
  const outdir = options?.outdir || join(".vercel/output/static");

  try {
    await fs.ensureDir(outdir);

    await generateClientBundle({ filePath, outdir, pageName });
  } catch (e) {
    console.log(e);
  }

  return fs.writeFileSync(
    path.join(outdir, options?.fileName || `${pageName}.html`),
    `<!DOCTYPE html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="styles.css" rel="stylesheet">
      </head>
      <body>
        <div id="__previous">${ReactDOMServer.renderToString(
          React.createElement(Component)
        )}</div>
        <script src="${pageName}.bundle.js" defer></script>
      </body>`
  );
}
