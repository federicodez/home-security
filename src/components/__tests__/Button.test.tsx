import { fireEvent, render } from "@testing-library/react-native";
import Button from "../Button";

describe("Button", () => {
  it("renders its text and handles presses", () => {
    const onPress = jest.fn();

    const { getByText } = render(<Button text="Send Code" onPress={onPress} />);

    fireEvent.press(getByText("Send Code"));

    expect(getByText("Send Code")).toBeTruthy();
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("does not call onPress when disabled", () => {
    const onPress = jest.fn();

    const { getByText } = render(
      <Button text="Send Code" onPress={onPress} disabled />,
    );

    fireEvent.press(getByText("Send Code"));

    expect(onPress).not.toHaveBeenCalled();
  });
});
