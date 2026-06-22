import type {
  AssignmentWithRelations,
  ProfileRow,
  VolunteerWithAssignments,
} from "@/types";

export const profile = {
  id: "profile-1",
  full_name: "Ada Lovelace",
  email: "ada@example.com",
  avatar_url: null,
  role: "volunteer",
  created_at: "2026-01-01T00:00:00.000Z",
  available_8am: true,
  available_930am: false,
  available_11am: true,
} as ProfileRow;

export const makeAssignment = (
  overrides: Partial<AssignmentWithRelations> = {},
): AssignmentWithRelations =>
  ({
    id: "assignment-1",
    service_id: "service-1",
    position_id: "position-1",
    user_id: profile.id,
    created_at: "2026-01-01T00:00:00.000Z",
    station: "A",
    profile: {
      id: profile.id,
      full_name: profile.full_name,
      email: profile.email,
      avatar_url: profile.avatar_url,
      role: profile.role,
      created_at: profile.created_at,
      available_8am: profile.available_8am,
      available_930am: profile.available_930am,
      available_11am: profile.available_11am,
    },
    service: {
      id: "service-1",
      name: "8am",
      starts_at: "2026-01-01T08:00:00.000Z",
    },
    position: {
      id: "position-1",
      station: "A",
      x: 100,
      y: 200,
    },
    ...overrides,
  }) as AssignmentWithRelations;

export const volunteerAssignments: VolunteerWithAssignments[] = [
  {
    id: "profile-1",
    full_name: "Ada Lovelace",
    email: "ada@example.com",
    avatar_url: null,
    role: "volunteer",
    available_8am: true,
    available_930am: false,
    available_11am: true,
    assignments: [
      {
        station: "A",
        service_id: "service-1",
        service: {
          id: "service-1",
          name: "8am",
          starts_at: "2026-01-01T08:00:00.000Z",
        },
      },
    ],
  },
];
