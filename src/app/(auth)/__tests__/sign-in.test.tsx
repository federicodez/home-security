import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import Login from "../sign-in";
import { supabase } from "@/utils/supabase";

jest.mock("@/utils/supabase", () => ({
  supabase: {
    auth: {
      signInWithOtp: jest.fn(),
      verifyOtp: jest.fn(),
    },
    from: jest.fn(),
  },
}));

const mockSupabase = jest.mocked(supabase);

const mockAuthError = (message: string) =>
  ({
    name: "AuthError",
    message,
    code: "mock_auth_error",
    status: 400,
    __isAuthError: true,
    toJSON: () => ({ name: "AuthError", message, status: 400 }),
  }) as never;

describe("Login", () => {
  const alertSpy = jest.spyOn(Alert, "alert").mockImplementation();
  const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

  beforeEach(() => {
    jest.useFakeTimers();
    mockSupabase.auth.signInWithOtp.mockResolvedValue({
      data: {
        user: null,
        session: null,
      },
      error: null,
    });
    mockSupabase.auth.verifyOtp.mockResolvedValue({
      data: {
        user: {
          id: "user-1",
          email: "ada@example.com",
          app_metadata: {},
          user_metadata: {},
          aud: "authenticated",
          created_at: "2026-01-01T00:00:00.000Z",
        },
        session: null,
      },
      error: null,
    });
    mockSupabase.from.mockReturnValue({
      upsert: jest.fn().mockResolvedValue({ error: null }),
    } as never);
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
    consoleLogSpy.mockClear();
  });

  it("renders the sign-in form", () => {
    const { getByText, getByPlaceholderText } = render(<Login />);

    expect(getByText("HOME CHURCH")).toBeTruthy();
    expect(getByText("Security Team")).toBeTruthy();
    expect(getByPlaceholderText("jon@gmail.com")).toBeTruthy();
    expect(getByPlaceholderText("jon")).toBeTruthy();
    expect(getByPlaceholderText("Snow")).toBeTruthy();
    expect(getByText("Send Code")).toBeTruthy();
  });

  it("requests an email code after the required fields are filled", async () => {
    const { getByText, getByPlaceholderText } = render(<Login />);

    fireEvent.changeText(getByPlaceholderText("jon@gmail.com"), "ada@example.com");
    fireEvent.changeText(getByPlaceholderText("jon"), "Ada");
    fireEvent.changeText(getByPlaceholderText("Snow"), "Lovelace");
    fireEvent.press(getByText("Send Code"));

    await waitFor(() => {
      expect(mockSupabase.auth.signInWithOtp).toHaveBeenCalledWith({
        email: "ada@example.com",
        options: {
          shouldCreateUser: false,
        },
      });
    });

    expect(getByText("One time code")).toBeTruthy();
  });

  it("stays on the email form when sending the code fails", async () => {
    mockSupabase.auth.signInWithOtp.mockResolvedValue({
      data: {
        user: null,
        session: null,
      },
      error: mockAuthError("User not found"),
    });

    const { getByText, getByPlaceholderText, queryByText } = render(<Login />);

    fireEvent.changeText(getByPlaceholderText("jon@gmail.com"), "ada@example.com");
    fireEvent.changeText(getByPlaceholderText("jon"), "Ada");
    fireEvent.changeText(getByPlaceholderText("Snow"), "Lovelace");
    fireEvent.press(getByText("Send Code"));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith("Failed to send code");
    });

    expect(queryByText("One time code")).toBeNull();
    expect(getByText("Send Code")).toBeTruthy();
  });

  it("submits the email code and creates the profile", async () => {
    const upsert = jest.fn().mockResolvedValue({ error: null });
    mockSupabase.from.mockReturnValue({ upsert } as never);

    const { getByText, getByPlaceholderText } = render(<Login />);

    fireEvent.changeText(getByPlaceholderText("jon@gmail.com"), "ada@example.com");
    fireEvent.changeText(getByPlaceholderText("jon"), "Ada");
    fireEvent.changeText(getByPlaceholderText("Snow"), "Lovelace");
    fireEvent.press(getByText("Send Code"));

    await waitFor(() => {
      expect(getByText("One time code")).toBeTruthy();
    });

    fireEvent.changeText(getByPlaceholderText("*****"), "123456");
    fireEvent.press(getByText("Submit"));

    await waitFor(() => {
      expect(mockSupabase.auth.verifyOtp).toHaveBeenCalledWith({
        email: "ada@example.com",
        token: "123456",
        type: "email",
      });
    });

    expect(mockSupabase.from).toHaveBeenCalledWith("profiles");
    expect(upsert).toHaveBeenCalledWith(
      {
        id: "user-1",
        email: "ada@example.com",
        full_name: "Ada Lovelace",
        available_8am: false,
        available_930am: false,
        available_11am: false,
      },
      { onConflict: "id" },
    );
  });

  it("alerts when code verification fails", async () => {
    const upsert = jest.fn().mockResolvedValue({ error: null });
    mockSupabase.from.mockReturnValue({ upsert } as never);
    mockSupabase.auth.verifyOtp.mockResolvedValue({
      data: {
        user: null,
        session: null,
      },
      error: mockAuthError("Invalid code"),
    });

    const { getByText, getByPlaceholderText } = render(<Login />);

    fireEvent.changeText(getByPlaceholderText("jon@gmail.com"), "ada@example.com");
    fireEvent.changeText(getByPlaceholderText("jon"), "Ada");
    fireEvent.changeText(getByPlaceholderText("Snow"), "Lovelace");
    fireEvent.press(getByText("Send Code"));

    await waitFor(() => {
      expect(getByText("One time code")).toBeTruthy();
    });

    fireEvent.changeText(getByPlaceholderText("*****"), "123456");
    fireEvent.press(getByText("Submit"));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith("Failed to verify code");
    });

    expect(upsert).not.toHaveBeenCalled();
  });
});
