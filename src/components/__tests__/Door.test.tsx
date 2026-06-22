import { render } from "@testing-library/react-native";
import { Line, Path } from "react-native-svg";
import Door from "../Door";

describe("Door", () => {
  it("draws a right-opening door with the expected wall and arc", () => {
    const { UNSAFE_getByType } = render(
      <Door x={10} y={20} size={30} direction="right" />,
    );

    expect(UNSAFE_getByType(Line).props).toEqual(
      expect.objectContaining({
        x1: 10,
        y1: 20,
        x2: 10,
        y2: 50,
      }),
    );
    expect(UNSAFE_getByType(Path).props.d).toBe(
      "M 10 20 A 30 30 0 0 1 40 50",
    );
  });

  it("draws an upward-opening door arc", () => {
    const { UNSAFE_getByType } = render(
      <Door x={10} y={20} size={30} direction="up" />,
    );

    expect(UNSAFE_getByType(Path).props.d).toBe(
      "M 40 20 A 30 30 0 0 1 10 -10",
    );
  });
});
