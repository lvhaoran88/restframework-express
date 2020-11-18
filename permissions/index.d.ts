import {Request} from "express";

declare interface Permission {
    hasPermission(req: Request): boolean | void
}

/**
 * 权限校验base类
 */
declare class BasePermission implements Permission {
    hasPermission(req: Request): boolean | void
}

module.exports = {
    BasePermission,
    Permission
}