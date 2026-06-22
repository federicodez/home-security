/* eslint-disable @typescript-eslint/no-require-imports */
import { render } from "@testing-library/react-native";
import FloorPlansPager from "../FloorPlansPager";

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

describe("FloorPlansPager", () => {
  it("renders one floor plan pager with the selected service", () => {
    const { getByText } = render(
      <FloorPlansPager service={{ id: "service-1", name: "8am" }} />,
    );

    expect(getByText("service-1:8am")).toBeTruthy();
  });
});
