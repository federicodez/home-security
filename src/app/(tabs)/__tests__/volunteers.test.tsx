/* eslint-disable @typescript-eslint/no-require-imports */
import { fireEvent, render } from "@testing-library/react-native";
import VolunteersTab from "../volunteers";
import {
  useInviteVolunteer,
  usePositionPreferences,
  useProfile,
  useUpdateAvailability,
  useUpdatePositionPreferences,
  useUpdateProfile,
  useVolunteerAssignments,
} from "@/api/profiles";
import { usePositionList } from "@/api/positions";

jest.mock("@/api/profiles", () => ({
  useInviteVolunteer: jest.fn(),
  usePositionPreferences: jest.fn(),
  useProfile: jest.fn(),
  useUpdateAvailability: jest.fn(),
  useUpdatePositionPreferences: jest.fn(),
  useUpdateProfile: jest.fn(),
  useVolunteerAssignments: jest.fn(),
}));

jest.mock("@/api/positions", () => ({
  usePositionList: jest.fn(),
}));

jest.mock("@expo/vector-icons", () => ({
  Ionicons: ({ name }: { name: string }) => {
    const React = require("react");
    const { Text } = require("react-native");

    return React.createElement(Text, null, name);
  },
}));

const mockUseInviteVolunteer = jest.mocked(useInviteVolunteer);
const mockUsePositionPreferences = jest.mocked(usePositionPreferences);
const mockUseProfile = jest.mocked(useProfile);
const mockUseUpdateAvailability = jest.mocked(useUpdateAvailability);
const mockUseUpdatePositionPreferences = jest.mocked(
  useUpdatePositionPreferences,
);
const mockUseUpdateProfile = jest.mocked(useUpdateProfile);
const mockUseVolunteerAssignments = jest.mocked(useVolunteerAssignments);
const mockUsePositionList = jest.mocked(usePositionList);

describe("VolunteersTab", () => {
  beforeEach(() => {
    mockUseProfile.mockReturnValue({
      data: {
        id: "profile-1",
        full_name: "Ada Lovelace",
        role: "volunteer",
        available_8am: true,
        available_930am: false,
        available_11am: false,
      },
    } as ReturnType<typeof useProfile>);
    mockUseVolunteerAssignments.mockReturnValue({
      data: [{ user_id: "profile-1", full_name: "Ada Lovelace", services: [] }],
    } as unknown as ReturnType<typeof useVolunteerAssignments>);
    mockUsePositionList.mockReturnValue({
      data: [{ station: "A" }, { station: "B" }],
    } as ReturnType<typeof usePositionList>);
    mockUsePositionPreferences.mockReturnValue({
      data: [],
    } as unknown as ReturnType<typeof usePositionPreferences>);
    mockUseUpdateAvailability.mockReturnValue({
      mutate: jest.fn(),
    } as unknown as ReturnType<typeof useUpdateAvailability>);
    mockUseUpdateProfile.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useUpdateProfile>);
    mockUseUpdatePositionPreferences.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useUpdatePositionPreferences>);
    mockUseInviteVolunteer.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useInviteVolunteer>);
  });

  it("opens volunteer help guidance", () => {
    const { getByText } = render(<VolunteersTab />);

    fireEvent.press(getByText("Help"));

    expect(getByText("How It Works")).toBeTruthy();
    expect(getByText("Set availability")).toBeTruthy();
    expect(getByText("Rank stations")).toBeTruthy();
    expect(getByText("Check assignments")).toBeTruthy();
  });

  it("opens admin help guidance", () => {
    mockUseProfile.mockReturnValue({
      data: {
        id: "profile-1",
        full_name: "Ada Lovelace",
        role: "admin",
      },
    } as ReturnType<typeof useProfile>);

    const { getByText } = render(<VolunteersTab />);

    fireEvent.press(getByText("Help"));

    expect(getByText("Assign stations")).toBeTruthy();
    expect(getByText("Clear a station")).toBeTruthy();
    expect(getByText("Manage volunteers")).toBeTruthy();
  });

  it("collapses and expands position preferences", () => {
    const { getByLabelText, queryByLabelText } = render(<VolunteersTab />);

    expect(queryByLabelText("Move A down")).toBeNull();

    fireEvent.press(getByLabelText("Toggle position preferences"));

    expect(getByLabelText("Move A down")).toBeTruthy();
  });
});
