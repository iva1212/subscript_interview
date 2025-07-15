import { BaseDBSchema } from "./base";

export interface RoleSchema extends BaseDBSchema {
    name: string;
    description: string;
    orgId: number; 
}