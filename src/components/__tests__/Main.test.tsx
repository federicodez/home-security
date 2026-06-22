/* eslint-disable @typescript-eslint/no-require-imports */
import { render } from "@testing-library/react-native";
import Main from "../Main";
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

jest.mock("../PositionList", () => {
  const React = require("react");
  const { Text } = require("react-native");

  function MockPositionList({ serviceId }: { serviceId: string }) {
    return React.createElement(Text, null, `positions-${serviceId}`);
  }

  MockPositionList.displayName = "MockPositionList";
  return MockPositionList;
});

describe("Main", () => {
  it("renders the main floor header and children", () => {
    const { getByText } = render(
      <Main
        serviceTime="8am"
        serviceId="service-1"
        modalVisible={false}
        onModalVisible={jest.fn()}
        onAssign={jest.fn()}
        onClear={jest.fn()}
        onPosition={jest.fn()}
        assignments={[makeAssignment()]}
      />,
    );

    expect(getByText("Main Sanctuary")).toBeTruthy();
    expect(getByText("8am Service")).toBeTruthy();
    expect(getByText("users-service-1")).toBeTruthy();
    expect(getByText("positions-service-1")).toBeTruthy();
  });
});
