/* eslint-disable @typescript-eslint/no-require-imports */
import { render } from "@testing-library/react-native";
import Outside from "../Outside";
import { makeAssignment } from "../__fixtures__/fixtures";

jest.mock("../UsersModal", () => {
  const React = require("react");
  const { Text } = require("react-native");

  function MockUsersModal({ serviceId }: { serviceId: string }) {
    return React.createElement(Text, null, `users-${serviceId}`);
  }

  MockUsersModal.displayName = "MockUsersModal";
  return MockUsersModal;
});

jest.mock("../Station", () => {
  const React = require("react");
  const { Text } = require("react-native");

  function MockStation({ assignment }: { assignment: { station: string } }) {
    return React.createElement(Text, null, `station-${assignment.station}`);
  }

  MockStation.displayName = "MockStation";
  return MockStation;
});

jest.mock("../Door", () => {
  const React = require("react");
  const { Text } = require("react-native");

  function MockDoor() {
    return React.createElement(Text, null, "door");
  }

  MockDoor.displayName = "MockDoor";
  return MockDoor;
});

describe("Outside", () => {
  const props = {
    serviceTime: "8am",
    serviceId: "service-1",
    modalVisible: false,
    onModalVisible: jest.fn(),
    onAssign: jest.fn(),
    onClear: jest.fn(),
    onPosition: jest.fn(),
  };

  it("renders outside assignments for the selected service", () => {
    const { getByText } = render(
      <Outside
        {...props}
        assignments={[
          makeAssignment({ id: "o1", station: "O1" }),
          makeAssignment({ id: "o2", station: "O2" }),
        ]}
      />,
    );

    expect(getByText("Outside Grounds")).toBeTruthy();
    expect(getByText("8am Service")).toBeTruthy();
    expect(getByText("station-O1")).toBeTruthy();
    expect(getByText("station-O2")).toBeTruthy();
    expect(getByText("users-service-1")).toBeTruthy();
  });

  it("renders nothing when there are no outside assignments", () => {
    const { toJSON } = render(
      <Outside {...props} assignments={[makeAssignment({ station: "A" })]} />,
    );

    expect(toJSON()).toBeNull();
  });
});
