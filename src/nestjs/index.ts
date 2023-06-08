import { Injectable, NestMiddleware } from "@nestjs/common";
import { YourDeepLink } from "..";
import { YourDeepLinkOptions } from "../interfaces";

@Injectable()
export class YourDeepLinkMiddleware implements NestMiddleware {
  use: (req: any, res: any, next: (error?: any) => void) => any;

  constructor(private readonly options: Partial<YourDeepLinkOptions>) {
    this.use = YourDeepLink(options);
  }
}
