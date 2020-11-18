import {NextFunction, Request, Response} from "express";
import {Permission} from "../permissions";
import {Authenticator} from "../authentications";

declare abstract class APIView {
    permissionClasses: Permission[];
    authenticationClasses: Authenticator[]
    throttleClasses: []

    get(req: Request, res: Response, next?: NextFunction): any;

    post(req: Request, res: Response, next?: NextFunction): any;

    put(req: Request, res: Response, next?: NextFunction): any;

    patch(req: Request, res: Response, next?: NextFunction): any;

    delete(req: Request, res: Response, next?: NextFunction): any;

    head(req: Request, res: Response, next?: NextFunction): any;

    options(req: Request, res: Response, next?: NextFunction): any;

    trace(req: Request, res: Response, next?: NextFunction): any;

    static asView: any;
}

export = {APIView}

