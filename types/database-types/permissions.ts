import { BaseDBSchema } from "./base";

export enum PermissionGrants {
    READ = "READ",
    WRITE = "WRITE",
    DELETE = "DELETE",
}

export interface PermissionSchema extends BaseDBSchema {
    name:string,
    grants:PermissionGrants[],
    roleId:number,
    statusId:number,
}