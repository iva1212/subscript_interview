import { UserSchema } from "../../types/database-types/user";
import * as todos from "../database/todo-queries";
export abstract class BaseController<T> {
  constructor(private readonly tableName: string) {}

  async all(user?:UserSchema): Promise<T[]> {
    return todos.all<T>(this.tableName);
  }

  async get(id: number) {
    return todos.get<T>(id, this.tableName);
  }
  
  async create(entity: T) {
    return todos.create<T>(entity, this.tableName);
  }

  async update(id: number, properties: Partial<T>) {
    return todos.update<T>(id, properties, this.tableName);
  }

  async del(id: number) {
    return todos.del<T>(id, this.tableName);
  }

  async clear() {
    return todos.clear<T>(this.tableName);
  }
}
