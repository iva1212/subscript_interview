import { BaseController } from "./base-controllers";
import { UserSchema } from "../../types/database-types/user";
import { getByEmail } from "../database/users/user-queries";
import { getAuth } from "firebase-admin/auth";

export class UserController extends BaseController<UserSchema> {
  constructor() {
    super("users");
  }

  async create(entity: UserSchema & { password: string }): Promise<UserSchema> {
    // Create user in firebase
    let auth = getAuth();
    try {
      const firebaseUser = await auth.createUser({
        email: entity.email,
        password: entity.password, // Ensure password is hashed before storing
      });
      const { password, ...userWithoutPassword } = entity;
      return super.create(userWithoutPassword);
    } catch (error) {}
  }

  getUserByEmail(email: string) {
    return getByEmail(email);
  }
}
