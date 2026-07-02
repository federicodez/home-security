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
    | "created_at"
    | "available_8am"
    | "available_930am"
    | "available_11am"
  > | null;

  service: Pick<ServiceRow, "id" | "name" | "starts_at">;

  position: Pick<PositionRow, "station" | "x" | "y">;
};

export type VolunteerWithAssignments = Pick<
  Database["public"]["Tables"]["profiles"]["Row"],
  | "id"
  | "full_name"
  | "email"
  | "avatar_url"
  | "role"
  | "available_8am"
  | "available_930am"
  | "available_11am"
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
  position_preferences?: {
    station: string;
    rank: number;
  }[];
};

export const AVAILABILITY_FIELDS = {
  available_8am: "available_8am",
  available_930am: "available_930am",
  available_11am: "available_11am",
} as const;

export type AvailabilityField = keyof typeof AVAILABILITY_FIELDS;

export type AvailabilityUpdate = {
  [AVAILABILITY_FIELDS.available_8am]?: boolean;
  [AVAILABILITY_FIELDS.available_930am]?: boolean;
  [AVAILABILITY_FIELDS.available_11am]?: boolean;
};
