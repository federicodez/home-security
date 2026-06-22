import { fireEvent, render } from "@testing-library/react-native";
import PaginationDots from "../PaginationDots";

describe("PaginationDots", () => {
  it("renders one dot for each page", () => {
    const { getAllByRole } = render(
      <PaginationDots current={1} total={3} onDotPress={jest.fn()} />,
    );

    expect(getAllByRole("button")).toHaveLength(3);
  });

  it("marks the current dot and handles dot presses", () => {
    const onDotPress = jest.fn();

    const { getAllByRole } = render(
      <PaginationDots current={1} total={3} onDotPress={onDotPress} />,
    );

    const dots = getAllByRole("button");

    expect(dots[0].props.style.backgroundColor).toBe(
      "rgba(255,255,255,0.25)",
    );
    expect(dots[1].props.style.backgroundColor).toBe("#D4BE8F");

    fireEvent.press(dots[2]);

    expect(onDotPress).toHaveBeenCalledWith(2);
  });
});
