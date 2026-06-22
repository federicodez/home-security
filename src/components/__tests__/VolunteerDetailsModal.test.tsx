import { fireEvent, render } from "@testing-library/react-native";
import VolunteerDetailsModal from "../VolunteerDetailsModal";

describe("VolunteerDetailsModal", () => {
  const services = [
    { service_name: "8am", station: "A" },
    { service_name: "9:30am", station: null },
    { service_name: "11am", station: "K" },
  ];

  it("renders assignment details", () => {
    const { getByText } = render(
      <VolunteerDetailsModal
        visible
        full_name="Ada Lovelace"
        assignedCount={2}
        services={services}
        onClose={jest.fn()}
      />,
    );

    expect(getByText("Ada Lovelace")).toBeTruthy();
    expect(getByText("2 / 3 Services Assigned")).toBeTruthy();
    expect(getByText("Station A")).toBeTruthy();
    expect(getByText("Unassigned")).toBeTruthy();
    expect(getByText("Station K")).toBeTruthy();
  });

  it("closes from the close button", () => {
    const onClose = jest.fn();

    const { getByText } = render(
      <VolunteerDetailsModal
        visible
        full_name="Ada Lovelace"
        assignedCount={2}
        services={services}
        onClose={onClose}
      />,
    );

    fireEvent.press(getByText("Close"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
