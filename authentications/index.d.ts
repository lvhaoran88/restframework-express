import {Request} from "express";

declare interface Authenticator {
    authenticate(req: Request): [any, any] | void
}

declare class BaseAuthentication implements Authenticator {
    authenticate(req: Request): [any, any] | void
}

module.exports = {
    Authenticator,
    BaseAuthentication
}