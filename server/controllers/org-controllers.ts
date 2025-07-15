import { OrganizationSchema } from "../../types/database-types/organization";
import { BaseController } from "./base-controllers";

export class OrganizationController extends BaseController<OrganizationSchema> {
  constructor() {
    super("organizations");
  }
}
