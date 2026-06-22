import { renderHook, waitFor } from "@testing-library/react-native";
import { useAssignmentList, useUpdateAssignment } from "../assignments";
import { supabase } from "@/utils/supabase";
import { createQueryWrapper, createTestQueryClient } from "../test-utils";

jest.mock("@/utils/supabase", () => ({
  supabase: {
    from: jest.fn(),
    rpc: jest.fn(),
  },
}));

const mockSupabase = jest.mocked(supabase);

function mockAssignmentQuery({
  data = [{ id: "assignment-1", station: "A" }],
  error = null,
}: {
  data?: unknown;
  error?: unknown;
} = {}) {
  const eq = jest.fn().mockResolvedValue({ data, error });
  const query = {
    eq,
    then: (resolve: (value: unknown) => void) => resolve({ data, error }),
  };
  const order = jest.fn(() => query);
  const select = jest.fn(() => ({ order }));
  mockSupabase.from.mockReturnValue({ select } as never);

  return { select, order, eq };
}

describe("assignments api", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads assignments for a service", async () => {
    const { select, order, eq } = mockAssignmentQuery();

    const { result } = renderHook(() => useAssignmentList("service-1"), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockSupabase.from).toHaveBeenCalledWith("assignments");
    expect(select).toHaveBeenCalledWith(expect.stringContaining("profile:user_id"));
    expect(order).toHaveBeenCalledWith("station");
    expect(eq).toHaveBeenCalledWith("service_id", "service-1");
    expect(result.current.data).toEqual([{ id: "assignment-1", station: "A" }]);
  });

  it("normalizes Supabase relation arrays into single relation objects", async () => {
    mockAssignmentQuery({
      data: [
        {
          id: "assignment-1",
          station: "A",
          service: [{ id: "service-1", name: "8am" }],
          profile: [{ id: "profile-1", full_name: "Ada Lovelace" }],
          position: [{ station: "A", x: 100, y: 200 }],
        },
      ],
    });

    const { result } = renderHook(() => useAssignmentList("service-1"), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.[0]).toEqual(
      expect.objectContaining({
        service: { id: "service-1", name: "8am" },
        profile: { id: "profile-1", full_name: "Ada Lovelace" },
        position: { station: "A", x: 100, y: 200 },
      }),
    );
  });

  it("surfaces assignment list errors", async () => {
    mockAssignmentQuery({
      data: null,
      error: { message: "assignments failed" },
    });

    const { result } = renderHook(() => useAssignmentList("service-1"), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(new Error("assignments failed"));
  });

  it("updates an assignment and invalidates dependent queries", async () => {
    mockSupabase.rpc.mockResolvedValue({ error: null });
    const queryClient = createTestQueryClient();
    const invalidateQueries = jest.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useUpdateAssignment(), {
      wrapper: createQueryWrapper(queryClient),
    });

    result.current.mutate({
      serviceId: "service-1",
      station: "A",
      profileId: "profile-1",
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockSupabase.rpc).toHaveBeenCalledWith("assign_user_to_station", {
      p_user: "profile-1",
      p_service: "service-1",
      p_station: "A",
    });
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
});
