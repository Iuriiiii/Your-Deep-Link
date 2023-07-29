import path from "path";
import fs from "fs";
import "lostjs/common";
function patch(options, items, selector) {
    const entries = Object.entries(options);
    for (const [key, value] of entries) {
        if (!key.endsWith("Link")) {
            continue;
        }
        const itemEntries = Object.entries(items);
        for (const [itemKey, itemValue] of itemEntries) {
            const selection = selector + itemKey;
            if (value.includes(selection)) {
                /* @ts-ignore */
                options[key] = options[key].replaceAll(selection, itemValue);
            }
        }
    }
}
export function YourDeepLink(options) {
    options.pageTitle ||= "Your Deep Link";
    options.customIndexPath ||= path.join(__dirname, "..", "/public/index.html");
    options.customScriptPath ||= path.join(__dirname, "..", "/public/script.js");
    options.fallbackLink ||= "https://www.google.com/";
    const { customIndexPath, customScriptPath, androidPackageName, } = options;
    if (androidPackageName && !options.playStoreLink) {
        options.playStoreLink ||= `https://play.google.com/store/apps/details?id=${androidPackageName}`;
    }
    const indexContent = new TextDecoder().decode(fs.readFileSync(customIndexPath));
    const scriptContent = new TextDecoder().decode(fs.readFileSync(customScriptPath));
    return function (request, response, next) {
        options.params = request.params;
        options.query = request.query;
        options.body = request.body;
        if (Object.entries(options.query).length) {
            /* @ts-ignore */
            const query = new URLSearchParams(options.query).toString();
            patch(options, { querys: "?" + query }, "$");
        }
        patch(options, options.params, ":");
        patch(options, options.query, "@");
        patch(options, options.body, "!");
        /**
         * Url should be the application url.
         */
        const { url, fallback } = request.query;
        fallback && (options.fallbackLink = fallback);
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
        }).replaceAll("'", "'"))
            .replaceAll("{{SCRIPT}}", scriptContent);
        response
            .set("Content-Type", "text/html;charset=utf-8")
            .status(200)
            .send(responseBody);
    };
}
export * from "./nestjs";
//# sourceMappingURL=index.js.map