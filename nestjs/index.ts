import { Injectable, NestMiddleware } from "@nestjs/common";
import { YourDeepLink } from "../src";
import { YourDeepLinkOptions } from "../src/interfaces";

@Injectable()
export class YourDeepLinkMiddleware implements NestMiddleware {
  constructor(private readonly options: Partial<YourDeepLinkOptions>) {}

  use = YourDeepLink(this.options);
}
