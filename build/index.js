import path from "path";
import fs from "fs";
export function YourDeepLink(options) {
    options.PageTitle ||= "Your Deep Link";
    options.customIndexPath ||= path.join(__dirname, "..", "/public/index.html");
    options.customScriptPath ||= path.join(__dirname, "..", "/public/script.js");
    options.onErrorGoTo ||= "https://www.google.com/";
    const { customIndexPath, customScriptPath, AndroidPackageName, } = options;
    if (AndroidPackageName && !options.PlayStoreLink) {
        options.PlayStoreLink ||= `https://play.google.com/store/apps/details?id=${AndroidPackageName}`;
    }
    const indexContent = new TextDecoder().decode(fs.readFileSync(customIndexPath));
    const scriptContent = new TextDecoder().decode(fs.readFileSync(customScriptPath));
    return function (request, response, next) {
        /**
         * Url should be the application url.
         */
        const { url, fallback } = request.query;
        fallback && (options.onErrorGoTo = fallback);
        url && (options.AppLink = url);
        if (!url) {
            return next();
        }
        const responseBody = indexContent
            .replaceAll("{{TITLE}}", options.PageTitle)
            .replaceAll("{{OPTIONS}}", JSON.stringify({
            ...options,
            customIndexPath: undefined,
            customScriptPath: undefined,
        }))
            .replaceAll("{{SCRIPT}}", scriptContent);
        response
            .set("Content-Type", "text/html;charset=utf-8")
            .status(200)
            .send(responseBody);
    };
}
//# sourceMappingURL=index.js.map