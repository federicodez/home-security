/* eslint-disable @typescript-eslint/no-require-imports */
import { render } from "@testing-library/react-native";
import AuthLayout from "../_layout";

const mockStack = jest.fn();

jest.mock("expo-router", () => {
  const React = require("react");
  const { View } = require("react-native");

  function Stack(props: { screenOptions?: { headerShown?: boolean } }) {
    mockStack(props);
    return React.createElement(View);
  }

  return { Stack };
});

describe("AuthLayout", () => {
  beforeEach(() => {
    mockStack.mockClear();
  });

  it("hides route headers", () => {
    render(<AuthLayout />);

    expect(mockStack).toHaveBeenCalledWith(
      expect.objectContaining({
        screenOptions: { headerShown: false },
      }),
    );
  });
});
