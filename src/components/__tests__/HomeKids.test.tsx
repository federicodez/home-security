/* eslint-disable @typescript-eslint/no-require-imports */
import { render } from "@testing-library/react-native";
import HomeKids from "../HomeKids";
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

describe("HomeKids", () => {
  const props = {
    serviceTime: "8am",
    serviceId: "service-1",
    modalVisible: false,
    onModalVisible: jest.fn(),
    onAssign: jest.fn(),
    onClear: jest.fn(),
    onPosition: jest.fn(),
  };

  it("renders the kids floor when the service has a kids assignment", () => {
    const { getByText } = render(
      <HomeKids {...props} assignments={[makeAssignment({ station: "K" })]} />,
    );

    expect(getByText("Home Kids")).toBeTruthy();
    expect(getByText("8am Service")).toBeTruthy();
    expect(getByText("station-K")).toBeTruthy();
    expect(getByText("users-service-1")).toBeTruthy();
  });

  it("renders nothing without a kids assignment", () => {
    const { toJSON } = render(
      <HomeKids {...props} assignments={[makeAssignment({ station: "A" })]} />,
    );

    expect(toJSON()).toBeNull();
  });
});
