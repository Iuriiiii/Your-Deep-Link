import { YourDeepLinkOptions } from "./interfaces";
import { Request, Response, NextFunction } from "express";
export declare function YourDeepLink(options: Partial<YourDeepLinkOptions>): (request: Request, response: Response, next: NextFunction) => void;
