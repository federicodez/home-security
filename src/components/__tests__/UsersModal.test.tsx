import { fireEvent, render } from "@testing-library/react-native";
import UsersModal from "../UsersModal";
import { useProfile, useVolunteers } from "@/api/profiles";
import { makeAssignment } from "../__fixtures__/fixtures";

jest.mock("@/api/profiles", () => ({
  useProfile: jest.fn(),
  useVolunteers: jest.fn(),
}));

const mockUseProfile = jest.mocked(useProfile);
const mockUseVolunteers = jest.mocked(useVolunteers);

describe("UsersModal", () => {
  beforeEach(() => {
    mockUseProfile.mockReturnValue({
      data: { id: "profile-admin", role: "admin" },
    } as ReturnType<typeof useProfile>);
    mockUseVolunteers.mockReturnValue({
      data: [
        {
          id: "profile-1",
          full_name: "Ada Lovelace",
          available_8am: false,
          position_preferences: [{ station: "A", rank: 2 }],
        },
        {
          id: "profile-2",
          full_name: "Grace Hopper",
          available_8am: true,
          position_preferences: [{ station: "A", rank: 1 }],
        },
      ],
    } as unknown as ReturnType<typeof useVolunteers>);
  });

  it("renders volunteers and assignment hints", () => {
    const { getByText } = render(
      <UsersModal
        serviceId="service-1"
        modalVisible
        onModalVisible={jest.fn()}
        onAssign={jest.fn()}
        onClear={jest.fn()}
        assignments={[makeAssignment()]}
        selectedStation="A"
        serviceAvailabilityColumn="available_8am"
      />,
    );

    expect(getByText("Assign Volunteer")).toBeTruthy();
    expect(getByText("1 available / 2 total")).toBeTruthy();
    expect(getByText("Clear Station A")).toBeTruthy();
    expect(getByText("ADA LOVELACE")).toBeTruthy();
    expect(getByText("Currently: Station A")).toBeTruthy();
    expect(getByText("GRACE HOPPER")).toBeTruthy();
    expect(getByText("Preference #1 for A")).toBeTruthy();
  });

  it("sorts available volunteers by preference for the selected station", () => {
    const { getAllByText } = render(
      <UsersModal
        serviceId="service-1"
        modalVisible
        onModalVisible={jest.fn()}
        onAssign={jest.fn()}
        onClear={jest.fn()}
        assignments={[]}
        selectedStation="A"
        serviceAvailabilityColumn="available_8am"
      />,
    );

    const volunteerNames = getAllByText(/ADA LOVELACE|GRACE HOPPER/).map(
      (node) => node.props.children,
    );

    expect(volunteerNames).toEqual(["GRACE HOPPER", "ADA LOVELACE"]);
  });

  it("assigns a volunteer and closes from cancel", () => {
    const onAssign = jest.fn();
    const onModalVisible = jest.fn();

    const { getByText } = render(
      <UsersModal
        serviceId="service-1"
        modalVisible
        onModalVisible={onModalVisible}
        onAssign={onAssign}
        onClear={jest.fn()}
        assignments={[]}
        selectedStation="A"
        serviceAvailabilityColumn="available_8am"
      />,
    );

    fireEvent.press(getByText("GRACE HOPPER"));
    fireEvent.press(getByText("Cancel"));

    expect(onAssign).toHaveBeenCalledWith("profile-2", "A");
    expect(onModalVisible).toHaveBeenCalledWith(false);
  });

  it("does not mark volunteers unavailable when availability is unknown", () => {
    mockUseVolunteers.mockReturnValueOnce({
      data: [
        {
          id: "profile-1",
          full_name: "Ada Lovelace",
          available_8am: null,
          available_930am: null,
          available_11am: null,
          position_preferences: [],
        },
      ],
    } as unknown as ReturnType<typeof useVolunteers>);

    const { getByText, queryByText } = render(
      <UsersModal
        serviceId="service-1"
        modalVisible
        onModalVisible={jest.fn()}
        onAssign={jest.fn()}
        onClear={jest.fn()}
        assignments={[]}
        selectedStation="A"
        serviceAvailabilityColumn="available_8am"
      />,
    );

    expect(getByText("1 volunteer")).toBeTruthy();
    expect(getByText("Available for this service")).toBeTruthy();
    expect(queryByText("Not marked available for this service")).toBeNull();
  });

  it("clears the selected assigned station from the modal", () => {
    const onClear = jest.fn();
    const onModalVisible = jest.fn();

    const { getByText } = render(
      <UsersModal
        serviceId="service-1"
        modalVisible
        onModalVisible={onModalVisible}
        onAssign={jest.fn()}
        onClear={onClear}
        assignments={[makeAssignment()]}
        selectedStation="A"
        serviceAvailabilityColumn="available_8am"
      />,
    );

    fireEvent.press(getByText("Clear Station A"));

    expect(onClear).toHaveBeenCalledWith("A");
    expect(onModalVisible).toHaveBeenCalledWith(false);
  });

  it("asks volunteers to confirm before taking the selected position", () => {
    mockUseProfile.mockReturnValue({
      data: { id: "profile-2", role: "volunteer" },
    } as ReturnType<typeof useProfile>);
    const onAssign = jest.fn();

    const { getByText, queryByText } = render(
      <UsersModal
        serviceId="service-1"
        modalVisible
        onModalVisible={jest.fn()}
        onAssign={onAssign}
        onClear={jest.fn()}
        assignments={[]}
        selectedStation="A"
        serviceAvailabilityColumn="available_8am"
      />,
    );

    expect(getByText("Take Position?")).toBeTruthy();
    expect(getByText("Station A")).toBeTruthy();
    expect(
      getByText("Do you want to take Station A for this service?"),
    ).toBeTruthy();
    expect(queryByText("ADA LOVELACE")).toBeNull();
    expect(queryByText("GRACE HOPPER")).toBeNull();

    fireEvent.press(getByText("Take Station A"));

    expect(onAssign).toHaveBeenCalledWith("profile-2", "A");
  });

  it("lets volunteers clear their own assignment", () => {
    mockUseProfile.mockReturnValue({
      data: { id: "profile-1", role: "volunteer" },
    } as ReturnType<typeof useProfile>);
    const onClear = jest.fn();

    const { getByText } = render(
      <UsersModal
        serviceId="service-1"
        modalVisible
        onModalVisible={jest.fn()}
        onAssign={jest.fn()}
        onClear={onClear}
        assignments={[makeAssignment()]}
        selectedStation="A"
        serviceAvailabilityColumn="available_8am"
      />,
    );

    expect(getByText("You are assigned to Station A.")).toBeTruthy();

    fireEvent.press(getByText("Remove Me From Station A"));

    expect(onClear).toHaveBeenCalledWith("A");
  });

  it("prevents volunteers from changing someone else's assignment", () => {
    mockUseProfile.mockReturnValue({
      data: { id: "profile-2", role: "volunteer" },
    } as ReturnType<typeof useProfile>);

    const { getByText, queryByText } = render(
      <UsersModal
        serviceId="service-1"
        modalVisible
        onModalVisible={jest.fn()}
        onAssign={jest.fn()}
        onClear={jest.fn()}
        assignments={[makeAssignment()]}
        selectedStation="A"
        serviceAvailabilityColumn="available_8am"
      />,
    );

    expect(getByText("Station A is already assigned.")).toBeTruthy();
    expect(queryByText("Clear Station A")).toBeNull();
    expect(queryByText("GRACE HOPPER")).toBeNull();
  });
});
