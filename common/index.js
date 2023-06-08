"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YourDeepLink = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
function YourDeepLink(options) {
    options.PageTitle ||= "Your Deep Link";
    options.customIndexPath ||= path_1.default.join(__dirname, "..", "/public/index.html");
    options.customScriptPath ||= path_1.default.join(__dirname, "..", "/public/script.js");
    options.onErrorGoTo ||= "https://www.google.com/";
    const { customIndexPath, customScriptPath, AndroidPackageName, } = options;
    if (AndroidPackageName && !options.PlayStoreLink) {
        options.PlayStoreLink ||= `https://play.google.com/store/apps/details?id=${AndroidPackageName}`;
    }
    const indexContent = new TextDecoder().decode(fs_1.default.readFileSync(customIndexPath));
    const scriptContent = new TextDecoder().decode(fs_1.default.readFileSync(customScriptPath));
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
exports.YourDeepLink = YourDeepLink;
//# sourceMappingURL=index.js.map