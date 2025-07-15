import { BaseDBSchema } from "./base";

export interface UserSchema extends BaseDBSchema {
  username: string;
  email: string;
  pronouns?: string;
  roleId: number;
  orgId: number;
  isAdmin?: boolean;
}
