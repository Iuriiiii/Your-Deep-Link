import path from "path";
import fs from "fs";
import { YourDeepLinkOptions } from "./interfaces";
import { Request, Response, NextFunction } from "express";

export * from "./nestjs";

export function YourDeepLink(options: Partial<YourDeepLinkOptions>) {
  options.pageTitle ||= "Your Deep Link";
  options.customIndexPath ||= path.join(__dirname, "..", "/public/index.html");
  options.customScriptPath ||= path.join(__dirname, "..", "/public/script.js");
  options.onErrorGoTo ||= "https://www.google.com/";

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
    /**
     * Url should be the application url.
     */
    const { url, fallback } = request.query as Record<string, string>;
    fallback && (options.onErrorGoTo = fallback);
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
        }).replaceAll("'", "\'")
      )
      .replaceAll("{{SCRIPT}}", scriptContent);

    response
      .set("Content-Type", "text/html;charset=utf-8")
      .status(200)
      .send(responseBody);
  };
}
