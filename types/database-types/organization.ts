import { BaseDBSchema } from "./base";

export interface OrganizationSchema extends BaseDBSchema {
  name: string;
  country: string;
}
