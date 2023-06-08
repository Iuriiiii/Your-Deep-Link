import { NestMiddleware } from "@nestjs/common";
import { YourDeepLinkOptions } from "../interfaces";
export declare class YourDeepLinkMiddleware implements NestMiddleware {
    private readonly options;
    use: (req: any, res: any, next: (error?: any) => void) => any;
    constructor(options: Partial<YourDeepLinkOptions>);
}
