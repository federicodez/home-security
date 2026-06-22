import { renderHook, waitFor } from "@testing-library/react-native";
import { usePositionList } from "../positions";
import { supabase } from "@/utils/supabase";
import { createQueryWrapper } from "../test-utils";

jest.mock("@/utils/supabase", () => ({
  supabase: {
    from: jest.fn(),
  },
}));

const mockSupabase = jest.mocked(supabase);

describe("positions api", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads positions", async () => {
    const select = jest.fn().mockResolvedValue({
      data: [{ station: "A", x: 100, y: 200 }],
      error: null,
    });
    mockSupabase.from.mockReturnValue({ select } as never);

    const { result } = renderHook(() => usePositionList(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockSupabase.from).toHaveBeenCalledWith("positions");
    expect(select).toHaveBeenCalledWith("*");
    expect(result.current.data).toEqual([{ station: "A", x: 100, y: 200 }]);
  });

  it("throws position errors with the Supabase message", async () => {
    const select = jest.fn().mockResolvedValue({
      data: null,
      error: { message: "no positions" },
    });
    mockSupabase.from.mockReturnValue({ select } as never);

    const { result } = renderHook(() => usePositionList(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(new Error("no positions"));
  });
});
