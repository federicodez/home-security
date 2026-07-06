import { render } from "@testing-library/react-native";
import { act } from "react";
import { Circle, G, Text as SvgText } from "react-native-svg";
import Station from "../Station";
import { makeAssignment } from "../__fixtures__/fixtures";

describe("Station", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("renders an assigned station and handles interactions", () => {
    const onModalVisible = jest.fn();
    const onPosition = jest.fn();
    const onClear = jest.fn();

    const { UNSAFE_getAllByType, UNSAFE_getByType } = render(
      <Station
        serviceId="service-1"
        assignment={makeAssignment()}
        modalVisible={false}
        onModalVisible={onModalVisible}
        onAssign={jest.fn()}
        onClear={onClear}
        onPosition={onPosition}
      />,
    );

    UNSAFE_getByType(G).props.onPress();

    act(() => {
      UNSAFE_getByType(G).props.onPressIn();
      jest.advanceTimersByTime(500);
      UNSAFE_getByType(G).props.onPressOut();
    });

    expect(UNSAFE_getAllByType(SvgText)[0].props.children).toContain("A");
    expect(UNSAFE_getAllByType(SvgText)[1].props.children).toContain("AL");
    expect(onModalVisible).toHaveBeenCalledWith(true);
    expect(onPosition).toHaveBeenCalledWith("A");
    expect(onClear).toHaveBeenCalledWith("A");
  });

  it("does not clear when the station is released before the hold threshold", () => {
    const onClear = jest.fn();

    const { UNSAFE_getByType } = render(
      <Station
        serviceId="service-1"
        assignment={makeAssignment()}
        modalVisible={false}
        onModalVisible={jest.fn()}
        onAssign={jest.fn()}
        onClear={onClear}
        onPosition={jest.fn()}
      />,
    );

    act(() => {
      UNSAFE_getByType(G).props.onPressIn();
      jest.advanceTimersByTime(499);
      UNSAFE_getByType(G).props.onPressOut();
    });

    expect(onClear).not.toHaveBeenCalled();
  });

  it("does not open the assign modal after a hold clear", () => {
    const onModalVisible = jest.fn();

    const { UNSAFE_getByType } = render(
      <Station
        serviceId="service-1"
        assignment={makeAssignment()}
        modalVisible={false}
        onModalVisible={onModalVisible}
        onAssign={jest.fn()}
        onClear={jest.fn()}
        onPosition={jest.fn()}
      />,
    );

    act(() => {
      UNSAFE_getByType(G).props.onPressIn();
      jest.advanceTimersByTime(500);
      UNSAFE_getByType(G).props.onPressOut();
    });

    UNSAFE_getByType(G).props.onPress();

    expect(onModalVisible).not.toHaveBeenCalled();
  });

  it("uses the unassigned station styling when no profile is present", () => {
    const { UNSAFE_getAllByType } = render(
      <Station
        serviceId="service-1"
        assignment={makeAssignment({ profile: null, user_id: null })}
        modalVisible
        onModalVisible={jest.fn()}
        onAssign={jest.fn()}
        onClear={jest.fn()}
        onPosition={jest.fn()}
      />,
    );

    expect(UNSAFE_getAllByType(Circle)[1].props.fill).toBe("#1F2937");
  });

  it("does not render when position coordinates are invalid", () => {
    const { toJSON } = render(
      <Station
        serviceId="service-1"
        assignment={makeAssignment({
          position: { station: "A", x: Number.NaN, y: 200 } as never,
        })}
        modalVisible={false}
        onModalVisible={jest.fn()}
        onAssign={jest.fn()}
        onClear={jest.fn()}
        onPosition={jest.fn()}
      />,
    );

    expect(toJSON()).toBeNull();
  });
});
