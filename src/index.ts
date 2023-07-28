import path from "path";
import fs from "fs";
import { YourDeepLinkOptions } from "./interfaces";
import { Request, Response, NextFunction } from "express";
import "lostjs/common";

function patch(
  options: Partial<YourDeepLinkOptions>,
  items: object,
  selector: string
) {
  const entries: [string, string][] = Object.entries(options);

  for (const [key, value] of entries) {
    if (!key.endsWith("Link")) {
      continue;
    }

    const itemEntries: [string, string][] = Object.entries(items);

    for (const [itemKey, itemValue] of itemEntries) {
      const selection: string = selector + itemKey;

      if (value.includes(selection)) {
        /* @ts-ignore */
        options[key] = options[key].replaceAll(selection, itemValue);
      }
    }
  }
}

export function YourDeepLink(options: Partial<YourDeepLinkOptions>) {
  options.pageTitle ||= "Your Deep Link";
  options.customIndexPath ||= path.join(__dirname, "..", "/public/index.html");
  options.customScriptPath ||= path.join(__dirname, "..", "/public/script.js");
  options.fallbackLink ||= "https://www.google.com/";

  const {
    customIndexPath,
    customScriptPath,
    androidPackageName,
  }: Partial<YourDeepLinkOptions> = options;

  if (androidPackageName && !options.playStoreLink) {
    options.playStoreLink ||= `https://play.google.com/store/apps/details?id=${androidPackageName}`;
  }

  const indexContent: string = new TextDecoder().decode(
    fs.readFileSync(customIndexPath)
  );
  const scriptContent: string = new TextDecoder().decode(
    fs.readFileSync(customScriptPath)
  );

  return function (request: Request, response: Response, next: NextFunction) {
    options.params = request.params;
    options.query = request.query;
    options.body = request.body;

    if (Object.entries(options.query).length) {
      /* @ts-ignore */
      const query: string = new URLSearchParams(options.query).toString();
      patch(options, { querys: query }, "@");
    }

    patch(options, options.params, ":");
    patch(options, options.query, "@");
    patch(options, options.body, "!");

    /**
     * Url should be the application url.
     */
    const { url, fallback } = request.query as Record<string, string>;
    fallback && (options.fallbackLink = fallback);
    url && (options.appLink = url);

    // if (!url) {
    //   return next();
    // }

    const responseBody: string = indexContent
      .replaceAll("{{TITLE}}", options.pageTitle!)
      .replaceAll(
        "{{OPTIONS}}",
        JSON.stringify({
          ...options,
          customIndexPath: undefined,
          customScriptPath: undefined,
        }).replaceAll("'", "'")
      )
      .replaceAll("{{SCRIPT}}", scriptContent);

    response
      .set("Content-Type", "text/html;charset=utf-8")
      .status(200)
      .send(responseBody);
  };
}

export * from "./nestjs";
