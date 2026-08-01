import { render } from "@testing-library/react-native";
import { Circle, G, Text as SvgText } from "react-native-svg";
import Position from "../Position";
import { profile } from "../__fixtures__/fixtures";

describe("Position", () => {
  it("renders initials for an assigned position and handles press actions", () => {
    const onModalVisible = jest.fn();
    const onPosition = jest.fn();
    const onClear = jest.fn();

    const { UNSAFE_getAllByType, UNSAFE_getByType } = render(
      <Position
        user={profile}
        station="F"
        x={50}
        y={60}
        modalVisible={false}
        onModalVisible={onModalVisible}
        onPosition={onPosition}
        onClear={onClear}
      />,
    );

    UNSAFE_getByType(G).props.onPress();

    expect(UNSAFE_getAllByType(SvgText)[0].props.children).toBe("F");
    expect(UNSAFE_getAllByType(SvgText)[1].props.children).toBe("AL");
    expect(onModalVisible).toHaveBeenCalledWith(true);
    expect(onPosition).toHaveBeenCalledWith("F");
    expect(onClear).not.toHaveBeenCalled();
  });

  it("renders an unassigned position", () => {
    const { UNSAFE_getAllByType } = render(
      <Position
        user={null}
        station="D"
        x={50}
        y={60}
        modalVisible
        onModalVisible={jest.fn()}
        onPosition={jest.fn()}
        onClear={jest.fn()}
      />,
    );

    expect(UNSAFE_getAllByType(SvgText)[0].props.children).toBe("D");
    expect(UNSAFE_getAllByType(Circle)[1].props.fill).toBe("#374151");
  });
});
