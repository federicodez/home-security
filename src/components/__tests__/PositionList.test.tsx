/* eslint-disable @typescript-eslint/no-require-imports */
import { render } from "@testing-library/react-native";
import { Text } from "react-native";
import PositionList from "../PositionList";
import { makeAssignment } from "../__fixtures__/fixtures";

jest.mock("../Station", () => {
  const React = require("react");
  const { Text } = require("react-native");

  function MockStation({ assignment }: { assignment: { station: string } }) {
    return React.createElement(Text, null, `station-${assignment.station}`);
  }

  MockStation.displayName = "MockStation";
  return MockStation;
});

describe("PositionList", () => {
  it("renders only indoor assignments for the selected service", () => {
    const assignments = [
      makeAssignment({ id: "a", station: "A" }),
      makeAssignment({
        id: "outside",
        station: "O1",
        position: { id: "outside-pos", station: "O1", x: 1, y: 2 } as never,
      }),
      makeAssignment({
        id: "kids",
        station: "K",
        position: { id: "kids-pos", station: "K", x: 1, y: 2 } as never,
      }),
      makeAssignment({
        id: "other-service",
        service_id: "service-2",
        service: {
          id: "service-2",
          name: "9:30am",
          starts_at: "2026-01-01T09:30:00.000Z",
        },
      }),
    ];

    const { getByText, queryByText, UNSAFE_getAllByType } = render(
      <PositionList
        serviceId="service-1"
        modalVisible={false}
        onModalVisible={jest.fn()}
        onAssign={jest.fn()}
        onClear={jest.fn()}
        onPosition={jest.fn()}
        assignments={assignments}
      />,
    );

    expect(getByText("station-A")).toBeTruthy();
    expect(queryByText("station-O1")).toBeNull();
    expect(queryByText("station-K")).toBeNull();
    expect(UNSAFE_getAllByType(Text)).toHaveLength(1);
  });
});
