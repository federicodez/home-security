import { Database } from "@/database.types";

export type AssignmentRow = Database["public"]["Tables"]["assignments"]["Row"];

export type ServiceRow = Database["public"]["Tables"]["services"]["Row"];

export type PositionRow = Database["public"]["Tables"]["positions"]["Row"];

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export type AssignmentWithRelations = AssignmentRow & {
  profile: Pick<
    ProfileRow,
    | "id"
    | "full_name"
    | "email"
    | "avatar_url"
    | "role"
    | "volunteering"
    | "created_at"
  > | null;

  service: Pick<ServiceRow, "id" | "name" | "starts_at">;

  position: Pick<PositionRow, "station" | "x" | "y">;
};

export type VolunteerWithAssignments = Pick<
  Database["public"]["Tables"]["profiles"]["Row"],
  "id" | "full_name" | "email" | "avatar_url" | "role" | "volunteering"
> & {
  assignments: {
    station: string;
    service_id: string;
    service: {
      id: string;
      name: string;
      starts_at: string;
    };
  }[];
};
