import { renderHook, waitFor } from "@testing-library/react-native";
import {
  fetchVolunteerAssignments,
  useProfile,
  useUpdateProfile,
  useUpdateAvailability,
  useVolunteerAssignments,
  useVolunteers,
  usePositionPreferences,
  useUpdatePositionPreferences,
  useInviteVolunteer,
} from "../profiles";
import { supabase } from "@/utils/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { createQueryWrapper, createTestQueryClient } from "../test-utils";

jest.mock("@/utils/supabase", () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
    functions: {
      invoke: jest.fn(),
    },
    from: jest.fn(),
    rpc: jest.fn(),
  },
}));

jest.mock("@/providers/AuthProvider", () => ({
  useAuth: jest.fn(),
}));

const mockSupabase = jest.mocked(supabase);
const mockUseAuth = jest.mocked(useAuth);

describe("profiles api", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      session: null,
      user: {
        id: "profile-1",
        email: "ada@example.com",
        user_metadata: {
          full_name: "Ada Lovelace",
          avatar_url: "https://example.com/avatar.png",
        },
      },
      loading: false,
      signOut: jest.fn(),
    } as unknown as ReturnType<typeof useAuth>);
  });

  it("loads an existing profile for the signed-in user", async () => {
    const maybeSingle = jest.fn().mockResolvedValue({
      data: { id: "profile-1", full_name: "Ada Lovelace" },
      error: null,
    });
    const eq = jest.fn(() => ({ maybeSingle }));
    const select = jest.fn(() => ({ eq }));
    mockSupabase.from.mockReturnValue({ select } as never);

    const { result } = renderHook(() => useProfile(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockSupabase.from).toHaveBeenCalledWith("profiles");
    expect(eq).toHaveBeenCalledWith("id", "profile-1");
    expect(result.current.data).toEqual({
      id: "profile-1",
      full_name: "Ada Lovelace",
    });
  });

  it("returns null when the signed-in user has no approved profile", async () => {
    const maybeSingle = jest.fn().mockResolvedValue({
      data: null,
      error: null,
    });
    const eq = jest.fn(() => ({ maybeSingle }));
    const select = jest.fn(() => ({ eq }));
    mockSupabase.from.mockReturnValue({ select } as never);

    const { result } = renderHook(() => useProfile(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeNull();
  });

  it("fetches volunteer assignments from the rpc", async () => {
    mockSupabase.rpc.mockResolvedValue({
      data: [{ user_id: "profile-1", full_name: "Ada Lovelace", services: [] }],
      error: null,
    });

    await expect(fetchVolunteerAssignments()).resolves.toEqual([
      { user_id: "profile-1", full_name: "Ada Lovelace", services: [] },
    ]);
    expect(mockSupabase.rpc).toHaveBeenCalledWith(
      "get_volunteer_service_assignments",
    );
  });

  it("uses the volunteer assignments fetcher in React Query", async () => {
    mockSupabase.rpc.mockResolvedValue({
      data: [{ user_id: "profile-1", full_name: "Ada Lovelace", services: [] }],
      error: null,
    });

    const { result } = renderHook(() => useVolunteerAssignments(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([
      { user_id: "profile-1", full_name: "Ada Lovelace", services: [] },
    ]);
  });

  it("loads volunteers using the selected service availability column", async () => {
    const serviceSingle = jest.fn().mockResolvedValue({
      data: { availability_column: "available_8am" },
      error: null,
    });
    const serviceEq = jest.fn(() => ({ single: serviceSingle }));
    const serviceSelect = jest.fn(() => ({ eq: serviceEq }));

    const order = jest.fn().mockResolvedValue({
      data: [{ id: "profile-1", full_name: "Ada Lovelace" }],
      error: null,
    });
    const profileEq = jest.fn(() => ({ order }));
    const profileSelect = jest.fn(() => ({ eq: profileEq }));

    mockSupabase.from
      .mockReturnValueOnce({ select: serviceSelect } as never)
      .mockReturnValueOnce({ select: profileSelect } as never);

    const { result } = renderHook(() => useVolunteers("service-1"), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(serviceEq).toHaveBeenCalledWith("id", "service-1");
    expect(profileEq).toHaveBeenCalledWith("available_8am", true);
    expect(order).toHaveBeenCalledWith("full_name");
    expect(result.current.data).toEqual([
      { id: "profile-1", full_name: "Ada Lovelace" },
    ]);
  });

  it("loads the current user's ranked position preferences", async () => {
    const order = jest.fn().mockResolvedValue({
      data: [
        { station: "B", rank: 1 },
        { station: "A", rank: 2 },
      ],
      error: null,
    });
    const eq = jest.fn(() => ({ order }));
    const select = jest.fn(() => ({ eq }));
    mockSupabase.from.mockReturnValue({ select } as never);

    const { result } = renderHook(() => usePositionPreferences(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockSupabase.from).toHaveBeenCalledWith("position_preferences");
    expect(eq).toHaveBeenCalledWith("user_id", "profile-1");
    expect(order).toHaveBeenCalledWith("rank");
    expect(result.current.data).toEqual([
      { station: "B", rank: 1 },
      { station: "A", rank: 2 },
    ]);
  });

  it("updates current user availability and invalidates dependent queries", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: {
        user: { id: "profile-1" },
      },
    } as never);
    const eq = jest.fn().mockResolvedValue({ error: null });
    const update = jest.fn(() => ({ eq }));
    mockSupabase.from.mockReturnValue({ update } as never);

    const queryClient = createTestQueryClient();
    const invalidateQueries = jest.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useUpdateAvailability(), {
      wrapper: createQueryWrapper(queryClient),
    });

    result.current.mutate({ available_8am: false });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(update).toHaveBeenCalledWith({ available_8am: false });
    expect(eq).toHaveBeenCalledWith("id", "profile-1");
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["assignments"],
    });
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["volunteer-assignments"],
    });
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["volunteers"],
    });
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ["profile"] });
  });

  it("replaces the current user's position preferences", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: {
        user: { id: "profile-1" },
      },
    } as never);
    const deleteEq = jest.fn().mockResolvedValue({ error: null });
    const deletePreferences = jest.fn(() => ({ eq: deleteEq }));
    const insert = jest.fn().mockResolvedValue({ error: null });
    mockSupabase.from
      .mockReturnValueOnce({ delete: deletePreferences } as never)
      .mockReturnValueOnce({ insert } as never);

    const queryClient = createTestQueryClient();
    const invalidateQueries = jest.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useUpdatePositionPreferences(), {
      wrapper: createQueryWrapper(queryClient),
    });

    result.current.mutate({ stations: ["B", "A"] });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(deleteEq).toHaveBeenCalledWith("user_id", "profile-1");
    expect(insert).toHaveBeenCalledWith([
      { user_id: "profile-1", station: "B", rank: 1 },
      { user_id: "profile-1", station: "A", rank: 2 },
    ]);
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["position-preferences"],
    });
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["volunteers"],
    });
  });

  it("invites a volunteer through the edge function", async () => {
    mockSupabase.functions.invoke.mockResolvedValue({
      data: { profile: { id: "profile-2" } },
      error: null,
    } as never);

    const queryClient = createTestQueryClient();
    const invalidateQueries = jest.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useInviteVolunteer(), {
      wrapper: createQueryWrapper(queryClient),
    });

    result.current.mutate({
      email: "  GRACE@example.COM ",
      full_name: "  Grace Hopper  ",
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockSupabase.functions.invoke).toHaveBeenCalledWith(
      "invite-volunteer",
      {
        body: {
          email: "grace@example.com",
          full_name: "Grace Hopper",
          role: "volunteer",
        },
      },
    );
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["volunteer-assignments"],
    });
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["volunteers"],
    });
  });

  it("updates the current user's profile name and invalidates roster queries", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: {
        user: { id: "profile-1" },
      },
    } as never);
    const eq = jest.fn().mockResolvedValue({ error: null });
    const update = jest.fn(() => ({ eq }));
    mockSupabase.from.mockReturnValue({ update } as never);

    const queryClient = createTestQueryClient();
    const invalidateQueries = jest.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useUpdateProfile(), {
      wrapper: createQueryWrapper(queryClient),
    });

    result.current.mutate({ full_name: "  Grace Hopper  " });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(update).toHaveBeenCalledWith({ full_name: "Grace Hopper" });
    expect(eq).toHaveBeenCalledWith("id", "profile-1");
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ["profile"] });
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["volunteer-assignments"],
    });
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["volunteers"],
    });
  });
});
