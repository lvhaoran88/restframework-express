import {Request} from "express";

declare class AuthenticationError extends Error {

}

declare export interface Authentication {
    authenticate(req: Request): [any, any] | void;
}

declare abstract class BaseAuthentication {
    abstract authenticate(req: Request): [any, any];

    authenticate_header(req: Request): any;
}

export {BaseAuthentication, AuthenticationError}
module.exports = {
    BaseAuthentication,
    AuthenticationError
}