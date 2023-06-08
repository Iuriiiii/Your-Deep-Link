import path from "path";
import fs from "fs";
export * from "./nestjs";
export function YourDeepLink(options) {
    options.pageTitle ||= "Your Deep Link";
    options.customIndexPath ||= path.join(__dirname, "..", "/public/index.html");
    options.customScriptPath ||= path.join(__dirname, "..", "/public/script.js");
    options.onErrorGoTo ||= "https://www.google.com/";
    const { customIndexPath, customScriptPath, androidPackageName, } = options;
    if (androidPackageName && !options.playStoreLink) {
        options.playStoreLink ||= `https://play.google.com/store/apps/details?id=${androidPackageName}`;
    }
    const indexContent = new TextDecoder().decode(fs.readFileSync(customIndexPath));
    const scriptContent = new TextDecoder().decode(fs.readFileSync(customScriptPath));
    return function (request, response, next) {
        /**
         * Url should be the application url.
         */
        const { url, fallback } = request.query;
        fallback && (options.onErrorGoTo = fallback);
        url && (options.appLink = url);
        // if (!url) {
        //   return next();
        // }
        const responseBody = indexContent
            .replaceAll("{{TITLE}}", options.pageTitle)
            .replaceAll("{{OPTIONS}}", JSON.stringify({
            ...options,
            customIndexPath: undefined,
            customScriptPath: undefined,
        }).replaceAll("'", "\'"))
            .replaceAll("{{SCRIPT}}", scriptContent);
        response
            .set("Content-Type", "text/html;charset=utf-8")
            .status(200)
            .send(responseBody);
    };
}
//# sourceMappingURL=index.js.map