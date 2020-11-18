import {DEFAULT} from "../settings";
import {Request, RequestHandler} from "express";

declare class BaseThrottle {
    allowRequest(req: Request, view: RequestHandler): any

    getIdent(req: Request): string | number

    wait(): string | number
}

declare class SimpleRateThrottle extends BaseThrottle {
    cache: any;
    scope: string | number
    THROTTLE_RATES: object

    cacheFormat(scope: string, ident: string | number): string

    getCacheKey(req: Request, view: RequestHandler): string | number

}

module.exports = DEFAULT