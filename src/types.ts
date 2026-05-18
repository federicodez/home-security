import { Database } from "@/database.types";

export type AssignmentRow = Database["public"]["Tables"]["assignments"]["Row"];

export type TeamMemberRow = Database["public"]["Tables"]["team_members"]["Row"];

export type ServiceRow = Database["public"]["Tables"]["services"]["Row"];

export type PositionRow = Database["public"]["Tables"]["positions"]["Row"];

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export type AssignmentWithRelations = AssignmentRow & {
  team_member: TeamMemberRow | null;

  service: Pick<ServiceRow, "id" | "name" | "starts_at">;

  position: Pick<PositionRow, "station" | "x" | "y">;
};
