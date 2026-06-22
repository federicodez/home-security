import { fireEvent, render } from "@testing-library/react-native";
import UsersModal from "../UsersModal";
import { useVolunteers } from "@/api/profiles";
import { makeAssignment } from "../__fixtures__/fixtures";

jest.mock("@/api/profiles", () => ({
  useVolunteers: jest.fn(),
}));

const mockUseVolunteers = jest.mocked(useVolunteers);

describe("UsersModal", () => {
  beforeEach(() => {
    mockUseVolunteers.mockReturnValue({
      data: [
        { id: "profile-1", full_name: "Ada Lovelace" },
        { id: "profile-2", full_name: "Grace Hopper" },
      ],
    } as ReturnType<typeof useVolunteers>);
  });

  it("renders volunteers and assignment hints", () => {
    const { getByText } = render(
      <UsersModal
        serviceId="service-1"
        modalVisible
        onModalVisible={jest.fn()}
        onAssign={jest.fn()}
        assignments={[makeAssignment()]}
      />,
    );

    expect(getByText("Assign Volunteer")).toBeTruthy();
    expect(getByText("2 available")).toBeTruthy();
    expect(getByText("ADA LOVELACE")).toBeTruthy();
    expect(getByText("Currently: Station A")).toBeTruthy();
    expect(getByText("GRACE HOPPER")).toBeTruthy();
    expect(getByText("Available for this service")).toBeTruthy();
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
        assignments={[]}
      />,
    );

    fireEvent.press(getByText("GRACE HOPPER"));
    fireEvent.press(getByText("Cancel"));

    expect(onAssign).toHaveBeenCalledWith("profile-2");
    expect(onModalVisible).toHaveBeenCalledWith(false);
  });
});
