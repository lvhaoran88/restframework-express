import {NextFunction, Request, Response} from "express";

declare class APIView {
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

export {APIView}