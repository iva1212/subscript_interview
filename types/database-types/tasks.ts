import { BaseDBSchema } from "./base";

export interface TaskSchema extends BaseDBSchema {
  title: string;
  description: string;
  comments?: string[]; // Optional field for task comments
  statusId: number; // Reference to StatusSchema
  assigneeId: number; // Reference to UserSchema
  managerId?: number; // Optional field for manager's UserSchema
  orgId: number; // Reference to OrganizationSchema
  dueDate?: Date; // Optional field for task due date
}
