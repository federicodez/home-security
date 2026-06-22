/* eslint-disable @typescript-eslint/no-require-imports */
import { render } from "@testing-library/react-native";
import { FlatList } from "react-native";
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
  it("configures a horizontal pager list for the floor plans", () => {
    const { UNSAFE_getByType } = render(
      <FloorPlansPager service={{ id: "service-1", name: "8am" }} />,
    );

    const list = UNSAFE_getByType(FlatList);

    expect(list.props.horizontal).toBe(true);
    expect(list.props.pagingEnabled).toBe(true);
    expect(list.props.data).toHaveLength(3);
    expect(list.props.keyExtractor({ id: "main" })).toBe("main");
  });

  it("renders floor plan pages with the selected service", () => {
    const { getAllByText } = render(
      <FloorPlansPager service={{ id: "service-1", name: "8am" }} />,
    );

    expect(getAllByText("service-1:8am")).toHaveLength(3);
  });
});
