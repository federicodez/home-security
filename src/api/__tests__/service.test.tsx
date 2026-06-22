import { renderHook, waitFor } from "@testing-library/react-native";
import { useGetServices } from "../service";
import { supabase } from "@/utils/supabase";
import { createQueryWrapper } from "../test-utils";

jest.mock("@/utils/supabase", () => ({
  supabase: {
    from: jest.fn(),
  },
}));

const mockSupabase = jest.mocked(supabase);

describe("service api", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads services ordered by start time", async () => {
    const order = jest.fn().mockResolvedValue({
      data: [{ id: "service-1", name: "8am" }],
      error: null,
    });
    const select = jest.fn(() => ({ order }));
    mockSupabase.from.mockReturnValue({ select } as never);

    const { result } = renderHook(() => useGetServices(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockSupabase.from).toHaveBeenCalledWith("services");
    expect(select).toHaveBeenCalledWith("*");
    expect(order).toHaveBeenCalledWith("starts_at", { ascending: true });
    expect(result.current.data).toEqual([{ id: "service-1", name: "8am" }]);
  });

  it("surfaces service loading errors", async () => {
    const error = new Error("service failed");
    const order = jest.fn().mockResolvedValue({ data: null, error });
    const select = jest.fn(() => ({ order }));
    mockSupabase.from.mockReturnValue({ select } as never);

    const { result } = renderHook(() => useGetServices(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBe(error);
  });
});
