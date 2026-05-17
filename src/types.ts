import { Database } from "@/database.types";

export type AssignmentRow = Database["public"]["Tables"]["assignments"]["Row"];

export type UserRow = Database["public"]["Tables"]["users"]["Row"];

export type ServiceRow = Database["public"]["Tables"]["services"]["Row"];

export type PositionRow = Database["public"]["Tables"]["positions"]["Row"];

export type AssignmentWithRelations = AssignmentRow & {
  user: UserRow | null;

  service: Pick<ServiceRow, "id" | "name" | "starts_at">;

  position: Pick<PositionRow, "station" | "x" | "y">;
};
