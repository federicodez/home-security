import { render, waitFor } from "@testing-library/react-native";
import { Text } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "../AuthProvider";
import { supabase } from "@/utils/supabase";

jest.mock("@/utils/supabase", () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      getUser: jest.fn(),
      onAuthStateChange: jest.fn(),
      signOut: jest.fn(),
    },
    from: jest.fn(),
  },
}));

const mockSupabase = jest.mocked(supabase);

function AuthState() {
  const { user, loading } = useAuth();

  return <Text>{loading ? "loading" : (user?.id ?? "signed-out")}</Text>;
}

function renderAuthProvider() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false, gcTime: Infinity },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthState />
      </AuthProvider>
    </QueryClientProvider>,
  );
}

describe("AuthProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSupabase.auth.onAuthStateChange.mockReturnValue({
      data: {
        subscription: {
          unsubscribe: jest.fn(),
        },
      },
    } as never);
    mockSupabase.auth.signOut.mockResolvedValue({ error: null });
  });

  it("keeps a valid session when the auth user and profile still exist", async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: {
        session: {
          user: { id: "profile-1" },
        },
      },
      error: null,
    } as never);
    mockSupabase.auth.getUser.mockResolvedValue({
      data: {
        user: { id: "profile-1" },
      },
      error: null,
    } as never);

    const maybeSingle = jest.fn().mockResolvedValue({
      data: { id: "profile-1" },
      error: null,
    });
    const eq = jest.fn(() => ({ maybeSingle }));
    const select = jest.fn(() => ({ eq }));
    mockSupabase.from.mockReturnValue({ select } as never);

    const { getByText } = renderAuthProvider();

    await waitFor(() => {
      expect(getByText("profile-1")).toBeTruthy();
    });

    expect(mockSupabase.auth.signOut).not.toHaveBeenCalled();
  });

  it("signs out a cached session when the auth user no longer exists", async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: {
        session: {
          user: { id: "profile-1" },
        },
      },
      error: null,
    } as never);
    mockSupabase.auth.getUser.mockResolvedValue({
      data: {
        user: null,
      },
      error: new Error("User not found"),
    } as never);

    const { getByText } = renderAuthProvider();

    await waitFor(() => {
      expect(getByText("signed-out")).toBeTruthy();
    });

    expect(mockSupabase.auth.signOut).toHaveBeenCalledTimes(1);
  });

  it("signs out a cached session when the approved profile no longer exists", async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: {
        session: {
          user: { id: "profile-1" },
        },
      },
      error: null,
    } as never);
    mockSupabase.auth.getUser.mockResolvedValue({
      data: {
        user: { id: "profile-1" },
      },
      error: null,
    } as never);

    const maybeSingle = jest.fn().mockResolvedValue({
      data: null,
      error: null,
    });
    const eq = jest.fn(() => ({ maybeSingle }));
    const select = jest.fn(() => ({ eq }));
    mockSupabase.from.mockReturnValue({ select } as never);

    const { getByText } = renderAuthProvider();

    await waitFor(() => {
      expect(getByText("signed-out")).toBeTruthy();
    });

    expect(mockSupabase.auth.signOut).toHaveBeenCalledTimes(1);
  });
});
