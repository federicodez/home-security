import { fireEvent, render } from "@testing-library/react-native";
import { Switch } from "react-native";
import Availability from "../Availability";
import type { ProfileRow } from "@/types";

const user = {
  id: "profile-1",
  full_name: "Ada Lovelace",
  email: "ada@example.com",
  avatar_url: null,
  role: "volunteer",
  created_at: "2026-01-01T00:00:00.000Z",
  available_8am: true,
  available_930am: false,
  available_11am: true,
} as ProfileRow;

describe("Availability", () => {
  it("renders the availability summary and service labels", () => {
    const { getByText } = render(
      <Availability
        user={user}
        availableCount={2}
        onUpdateAvailability={jest.fn()}
      />,
    );

    expect(getByText("Service Availability")).toBeTruthy();
    expect(getByText("2 / 3 Services Available")).toBeTruthy();
    expect(getByText("8:00 AM")).toBeTruthy();
    expect(getByText("9:30 AM")).toBeTruthy();
    expect(getByText("11:00 AM")).toBeTruthy();
  });

  it("calls onUpdateAvailability with the changed service value", () => {
    const onUpdateAvailability = jest.fn();

    const { UNSAFE_getAllByType } = render(
      <Availability
        user={user}
        availableCount={2}
        onUpdateAvailability={onUpdateAvailability}
      />,
    );

    const switches = UNSAFE_getAllByType(Switch);

    fireEvent(switches[1], "valueChange", true);

    expect(onUpdateAvailability).toHaveBeenCalledWith({
      available_930am: true,
    });
  });

  it("disables switches for services with assignments", () => {
    const { UNSAFE_getAllByType } = render(
      <Availability
        user={user}
        assigned8am
        assigned930am={false}
        assigned11am
        availableCount={2}
        onUpdateAvailability={jest.fn()}
      />,
    );

    const switches = UNSAFE_getAllByType(Switch);

    expect(switches[0].props.disabled).toBe(true);
    expect(switches[1].props.disabled).toBe(false);
    expect(switches[2].props.disabled).toBe(true);
  });
});
