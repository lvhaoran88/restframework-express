import {NextFunction, Request, Response} from "express";
import {Authentication} from "./authentication";
import {Permissions} from "./permissions";

declare export interface APIView {
    authenticationClasses: Authentication[];
    permissionClasses: Permissions[];

    get(res: Request, req: Response, next: NextFunction): any;

    post(res: Request, req: Response, next: NextFunction): any;

    put(res: Request, req: Response, next: NextFunction): any;

    patch(res: Request, req: Response, next: NextFunction): any;

    delete(res: Request, req: Response, next: NextFunction): any;

    head(res: Request, req: Response, next: NextFunction): any;

    options(res: Request, req: Response, next: NextFunction): any;

    trace(res: Request, req: Response, next: NextFunction): any;
}


declare class APIView {
    authenticationClasses: Authentication[];
    permissionClasses: Permissions[];

    get(res: Request, req: Response, next: NextFunction): any;
    get(res: Request, req: Response): any;

    post(res: Request, req: Response, next: NextFunction): any;
    post(res: Request, req: Response): any;

    put(res: Request, req: Response, next: NextFunction): any;
    put(res: Request, req: Response): any;

    patch(res: Request, req: Response, next: NextFunction): any;
    patch(res: Request, req: Response): any;

    delete(res: Request, req: Response, next: NextFunction): any;
    delete(res: Request, req: Response): any;

    head(res: Request, req: Response, next: NextFunction): any;
    head(res: Request, req: Response): any;

    options(res: Request, req: Response, next: NextFunction): any;
    options(res: Request, req: Response): any;

    trace(res: Request, req: Response, next: NextFunction): any;
    trace(res: Request, req: Response): any;

    static asView(): any;
}

module.exports = APIView
