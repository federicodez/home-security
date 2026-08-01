/* eslint-disable @typescript-eslint/no-require-imports */
import { fireEvent, render } from "@testing-library/react-native";
import FloorPlansPager from "../FloorPlansPager";
import { useProfile } from "@/api/profiles";

jest.mock("@/api/profiles", () => ({
  useProfile: jest.fn(),
}));

jest.mock("@expo/vector-icons", () => ({
  Ionicons: ({ name }: { name: string }) => {
    const React = require("react");
    const { Text } = require("react-native");

    return React.createElement(Text, null, name);
  },
}));

jest.mock("../FloorPlan", () => {
  const React = require("react");
  const { Text } = require("react-native");

  function MockFloorPlan({
    serviceId,
    serviceTime,
  }: {
    serviceId: string;
    serviceTime: string;
  }) {
    return React.createElement(Text, null, `${serviceId}:${serviceTime}`);
  }

  MockFloorPlan.displayName = "MockFloorPlan";
  return MockFloorPlan;
});

const mockUseProfile = jest.mocked(useProfile);

describe("FloorPlansPager", () => {
  beforeEach(() => {
    mockUseProfile.mockReturnValue({
      data: { id: "profile-1", role: "volunteer" },
    } as ReturnType<typeof useProfile>);
  });

  it("renders one floor plan pager with the selected service", () => {
    const { getByText } = render(
      <FloorPlansPager service={{ id: "service-1", name: "8am" }} />,
    );

    expect(getByText("service-1:8am")).toBeTruthy();
  });

  it("opens volunteer map help guidance", () => {
    const { getByLabelText, getByText } = render(
      <FloorPlansPager service={{ id: "service-1", name: "8am" }} />,
    );

    fireEvent.press(getByLabelText("Open help"));

    expect(getByText("Take a position")).toBeTruthy();
    expect(getByText("Remove yourself")).toBeTruthy();
    expect(getByText("Switch map areas")).toBeTruthy();
    expect(
      getByText(
        "Swipe left or right, or use the page dots, to check positions in Main Sanctuary, Outside Grounds, and Home Kids.",
      ),
    ).toBeTruthy();
  });

  it("opens admin map help guidance", () => {
    mockUseProfile.mockReturnValue({
      data: { id: "profile-1", role: "admin" },
    } as ReturnType<typeof useProfile>);

    const { getByLabelText, getByText } = render(
      <FloorPlansPager service={{ id: "service-1", name: "8am" }} />,
    );

    fireEvent.press(getByLabelText("Open help"));

    expect(getByText("Assign a position")).toBeTruthy();
    expect(getByText("Clear an assignment")).toBeTruthy();
    expect(getByText("Switch map areas")).toBeTruthy();
    expect(
      getByText(
        "Swipe left or right, or use the page dots, to move between Main Sanctuary, Outside Grounds, and Home Kids.",
      ),
    ).toBeTruthy();
  });
});
