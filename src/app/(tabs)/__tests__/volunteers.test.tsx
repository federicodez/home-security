/* eslint-disable @typescript-eslint/no-require-imports */
import { fireEvent, render } from "@testing-library/react-native";
import { Alert, Text } from "react-native";
import VolunteersTab from "../volunteers";
import {
  useInviteVolunteer,
  usePositionPreferences,
  useProfile,
  useResetAssignmentsAndAvailability,
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
  useResetAssignmentsAndAvailability: jest.fn(),
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
const mockUseResetAssignmentsAndAvailability = jest.mocked(
  useResetAssignmentsAndAvailability,
);
const mockUseUpdateAvailability = jest.mocked(useUpdateAvailability);
const mockUseUpdatePositionPreferences = jest.mocked(
  useUpdatePositionPreferences,
);
const mockUseUpdateProfile = jest.mocked(useUpdateProfile);
const mockUseVolunteerAssignments = jest.mocked(useVolunteerAssignments);
const mockUsePositionList = jest.mocked(usePositionList);
let updatePositionPreferencesMutate: jest.Mock;
let resetAssignmentsAndAvailabilityMutate: jest.Mock;

describe("VolunteersTab", () => {
  beforeEach(() => {
    updatePositionPreferencesMutate = jest.fn();
    resetAssignmentsAndAvailabilityMutate = jest.fn();
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
      data: [
        {
          user_id: "profile-1",
          full_name: "Ada Lovelace",
          services: [],
        },
      ],
    } as unknown as ReturnType<typeof useVolunteerAssignments>);
    mockUsePositionList.mockReturnValue({
      data: [{ station: "A" }, { station: "E" }],
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
      mutate: updatePositionPreferencesMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useUpdatePositionPreferences>);
    mockUseInviteVolunteer.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useInviteVolunteer>);
    mockUseResetAssignmentsAndAvailability.mockReturnValue({
      mutate: resetAssignmentsAndAvailabilityMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useResetAssignmentsAndAvailability>);
  });

  it("opens volunteer help guidance", () => {
    const { getByLabelText, getByText } = render(<VolunteersTab />);

    fireEvent.press(getByLabelText("Open help"));

    expect(getByText("How It Works")).toBeTruthy();
    expect(getByText("Set availability")).toBeTruthy();
    expect(getByText("Take a position")).toBeTruthy();
    expect(getByText("Rank preferences")).toBeTruthy();
    expect(getByText("Remove yourself")).toBeTruthy();
  });

  it("opens admin help guidance", () => {
    mockUseProfile.mockReturnValue({
      data: {
        id: "profile-1",
        full_name: "Ada Lovelace",
        role: "admin",
      },
    } as ReturnType<typeof useProfile>);

    const { getByLabelText, getByText } = render(<VolunteersTab />);

    fireEvent.press(getByLabelText("Open help"));

    expect(getByText("Assign stations")).toBeTruthy();
    expect(getByText("Clear a station")).toBeTruthy();
    expect(getByText("Manage volunteers")).toBeTruthy();
  });

  it("lets admins confirm a weekly reset", () => {
    const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});

    mockUseProfile.mockReturnValue({
      data: {
        id: "profile-1",
        full_name: "Ada Lovelace",
        role: "admin",
      },
    } as ReturnType<typeof useProfile>);

    const { getByText } = render(<VolunteersTab />);

    fireEvent.press(getByText("Reset"));

    expect(alertSpy).toHaveBeenCalledWith(
      "Reset week?",
      "This clears all assignments and availability for every volunteer.",
      expect.any(Array),
    );

    const resetAction = alertSpy.mock.calls[0][2]?.find(
      (action) => action.text === "Reset",
    );
    resetAction?.onPress?.();

    expect(resetAssignmentsAndAvailabilityMutate).toHaveBeenCalledWith(
      undefined,
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      }),
    );

    alertSpy.mockRestore();
  });

  it("collapses and expands position preferences", () => {
    const { getByLabelText, queryByLabelText } = render(<VolunteersTab />);

    expect(queryByLabelText("Move A down")).toBeNull();

    fireEvent.press(getByLabelText("Toggle position preferences"));

    expect(getByLabelText("Move A down")).toBeTruthy();
  });

  it("shows assignments before position preferences for volunteers", () => {
    const { UNSAFE_getAllByType } = render(<VolunteersTab />);
    const labels = UNSAFE_getAllByType(Text).map((node) => node.props.children);

    expect(labels.indexOf("Your Assignments")).toBeLessThan(
      labels.indexOf("Position Preferences"),
    );
  });

  it("saves the default important position order", () => {
    mockUsePositionList.mockReturnValue({
      data: [
        { station: "O" },
        { station: "F" },
        { station: "C" },
        { station: "K" },
        { station: "E" },
      ],
    } as ReturnType<typeof usePositionList>);

    const { getByLabelText, getByText } = render(<VolunteersTab />);

    fireEvent.press(getByLabelText("Toggle position preferences"));
    fireEvent.press(getByText("Save Preferences"));

    expect(updatePositionPreferencesMutate).toHaveBeenCalledWith(
      { stations: ["C", "K", "O", "E", "F"] },
      expect.any(Object),
    );
  });

});
