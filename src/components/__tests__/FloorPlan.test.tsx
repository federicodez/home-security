/* eslint-disable @typescript-eslint/no-require-imports */
import { act, fireEvent, render } from "@testing-library/react-native";
import FloorPlan from "../FloorPlan";
import { useAssignmentList, useUpdateAssignment } from "@/api/assignments";
import { makeAssignment } from "../__fixtures__/fixtures";

const mockSetPage = jest.fn();
const mockMain = jest.fn();
const mockOutside = jest.fn();
const mockHomeKids = jest.fn();

jest.mock("@/api/assignments", () => ({
  useAssignmentList: jest.fn(),
  useUpdateAssignment: jest.fn(),
}));

jest.mock("react-native-pager-view", () => {
  const React = require("react");
  const { View } = require("react-native");

  const MockPagerView = React.forwardRef(
    (
      {
        children,
        onPageSelected,
      }: {
        children: React.ReactNode;
        onPageSelected: (event: { nativeEvent: { position: number } }) => void;
      },
      ref: React.Ref<{ setPage: (index: number) => void }>,
    ) => {
      React.useImperativeHandle(ref, () => ({ setPage: mockSetPage }));
      return React.createElement(
        View,
        {
          testID: "pager",
          onPageSelected,
        },
        children,
      );
    },
  );

  MockPagerView.displayName = "MockPagerView";
  return MockPagerView;
});

jest.mock("../Main", () => {
  const React = require("react");
  const { Text } = require("react-native");

  function MockMain(props: Record<string, unknown>) {
    mockMain(props);
    return React.createElement(Text, null, "main-floor");
  }

  MockMain.displayName = "MockMain";
  return MockMain;
});

jest.mock("../Outside", () => {
  const React = require("react");
  const { Text } = require("react-native");

  function MockOutside(props: Record<string, unknown>) {
    mockOutside(props);
    return React.createElement(Text, null, "outside-floor");
  }

  MockOutside.displayName = "MockOutside";
  return MockOutside;
});

jest.mock("../HomeKids", () => {
  const React = require("react");
  const { Text } = require("react-native");

  function MockHomeKids(props: Record<string, unknown>) {
    mockHomeKids(props);
    return React.createElement(Text, null, "kids-floor");
  }

  MockHomeKids.displayName = "MockHomeKids";
  return MockHomeKids;
});

jest.mock("../PaginationDots", () => {
  const React = require("react");
  const { Pressable, Text } = require("react-native");

  function MockPaginationDots({
    current,
    onDotPress,
  }: {
    current: number;
    onDotPress: (index: number) => void;
  }) {
    return React.createElement(
      Pressable,
      { onPress: () => onDotPress(2) },
      React.createElement(Text, null, `dot-${current}`),
    );
  }

  MockPaginationDots.displayName = "MockPaginationDots";
  return MockPaginationDots;
});

jest.mock("../UsersModal", () => {
  const React = require("react");
  const { Text } = require("react-native");

  function MockUsersModal({ serviceId }: { serviceId: string }) {
    return React.createElement(Text, null, `users-${serviceId}`);
  }

  MockUsersModal.displayName = "MockUsersModal";
  return MockUsersModal;
});

const mockUseAssignmentList = jest.mocked(useAssignmentList);
const mockUseUpdateAssignment = jest.mocked(useUpdateAssignment);

describe("FloorPlan", () => {
  beforeEach(() => {
    mockSetPage.mockClear();
    mockMain.mockClear();
    mockOutside.mockClear();
    mockHomeKids.mockClear();
    mockUseAssignmentList.mockReturnValue({
      data: [makeAssignment()],
    } as ReturnType<typeof useAssignmentList>);
    mockUseUpdateAssignment.mockReturnValue({
      mutate: jest.fn(),
    } as unknown as ReturnType<typeof useUpdateAssignment>);
  });

  it("renders each floor with assignment data", () => {
    const { getByText } = render(
      <FloorPlan serviceId="service-1" serviceTime="8am" />,
    );

    expect(getByText("main-floor")).toBeTruthy();
    expect(getByText("outside-floor")).toBeTruthy();
    expect(getByText("kids-floor")).toBeTruthy();
    expect(getByText("users-service-1")).toBeTruthy();
    expect(mockMain).toHaveBeenCalledWith(
      expect.objectContaining({
        serviceId: "service-1",
        serviceTime: "8am",
        assignments: [makeAssignment()],
      }),
    );
  });

  it("moves the pager when a pagination dot is pressed", () => {
    const { getByText } = render(
      <FloorPlan serviceId="service-1" serviceTime="8am" />,
    );

    fireEvent.press(getByText("dot-0"));

    expect(mockSetPage).toHaveBeenCalledWith(2);
  });

  it("assigns and clears the selected station", () => {
    const mutate = jest.fn();
    mockUseUpdateAssignment.mockReturnValue({
      mutate,
    } as unknown as ReturnType<typeof useUpdateAssignment>);

    render(<FloorPlan serviceId="service-1" serviceTime="8am" />);

    act(() => {
      mockMain.mock.calls[0][0].onPosition("A");
    });

    const mainProps = mockMain.mock.calls.at(-1)?.[0];

    act(() => {
      mainProps.onAssign("profile-1");
      mainProps.onClear();
    });

    expect(mutate).toHaveBeenCalledWith({
      serviceId: "service-1",
      station: "A",
      profileId: "profile-1",
    });
    expect(mutate).toHaveBeenCalledWith({
      serviceId: "service-1",
      station: "A",
      profileId: null,
    });
  });
});
