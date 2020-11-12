import {Request} from 'express'

declare interface Permissions {
    hasPermission(req: Request): boolean;
}

declare abstract class BasePermission {
    abstract hasPermission(req: Request): boolean;
}

export {
    Permissions,
    BasePermission
}


module.exports = {
    Permissions,
    BasePermission
}