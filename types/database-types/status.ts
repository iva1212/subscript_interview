import { BaseDBSchema } from "./base";

export interface StatusSchema extends BaseDBSchema {
  name: string;
  roleIds: number[]; // Array of RoleSchema IDs that can modify this status
}
