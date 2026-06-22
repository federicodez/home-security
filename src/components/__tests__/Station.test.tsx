import { render } from "@testing-library/react-native";
import { Circle, G, Text as SvgText } from "react-native-svg";
import Station from "../Station";
import { makeAssignment } from "../__fixtures__/fixtures";

describe("Station", () => {
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
    UNSAFE_getByType(G).props.onLongPress();

    expect(UNSAFE_getAllByType(SvgText)[0].props.children).toContain("A");
    expect(UNSAFE_getAllByType(SvgText)[1].props.children).toContain("AL");
    expect(onModalVisible).toHaveBeenCalledWith(true);
    expect(onPosition).toHaveBeenCalledWith("A");
    expect(onClear).toHaveBeenCalledTimes(1);
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
});
