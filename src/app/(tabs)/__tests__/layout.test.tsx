/* eslint-disable @typescript-eslint/no-require-imports */
import { render } from "@testing-library/react-native";
import TabLayout from "../_layout";

const mockScreen = jest.fn();

jest.mock("expo-router", () => {
  const React = require("react");
  const { View } = require("react-native");

  function Tabs({ children }: { children: React.ReactNode }) {
    return <View>{children}</View>;
  }

  function Screen(props: { name: string; options: { title: string } }) {
    mockScreen(props);
    return React.createElement(View, {
      accessibilityLabel: props.options.title,
      testID: props.name,
    });
  }

  Screen.displayName = "Tabs.Screen";
  Tabs.Screen = Screen;

  return { Tabs };
});

jest.mock("@expo/vector-icons", () => ({
  MaterialCommunityIcons: ({ name }: { name: string }) => {
    const React = require("react");
    const { Text } = require("react-native");

    return React.createElement(Text, null, name);
  },
}));

describe("TabLayout", () => {
  beforeEach(() => {
    mockScreen.mockClear();
  });

  it("registers the expected tab screens", () => {
    render(<TabLayout />);

    expect(mockScreen).toHaveBeenCalledTimes(4);
    expect(mockScreen).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        name: "index",
        options: expect.objectContaining({ title: "8 AM" }),
      }),
    );
    expect(mockScreen).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        name: "second",
        options: expect.objectContaining({ title: "9:30" }),
      }),
    );
    expect(mockScreen).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        name: "third",
        options: expect.objectContaining({ title: "11 AM" }),
      }),
    );
    expect(mockScreen).toHaveBeenNthCalledWith(
      4,
      expect.objectContaining({
        name: "volunteers",
        options: expect.objectContaining({ title: "Roster" }),
      }),
    );
  });
});
