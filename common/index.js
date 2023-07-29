"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YourDeepLink = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
require("lostjs/common");
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
function YourDeepLink(options) {
    options.pageTitle ||= "Your Deep Link";
    options.customIndexPath ||= path_1.default.join(__dirname, "..", "/public/index.html");
    options.customScriptPath ||= path_1.default.join(__dirname, "..", "/public/script.js");
    options.fallbackLink ||= "https://www.google.com/";
    const { customIndexPath, customScriptPath, androidPackageName, } = options;
    if (androidPackageName && !options.playStoreLink) {
        options.playStoreLink ||= `https://play.google.com/store/apps/details?id=${androidPackageName}`;
    }
    const indexContent = new TextDecoder().decode(fs_1.default.readFileSync(customIndexPath));
    const scriptContent = new TextDecoder().decode(fs_1.default.readFileSync(customScriptPath));
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
exports.YourDeepLink = YourDeepLink;
__exportStar(require("./nestjs"), exports);
//# sourceMappingURL=index.js.map