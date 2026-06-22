import { fireEvent, render } from "@testing-library/react-native";
import { Switch } from "react-native";
import VolunteerModal from "../VolunteerModal";
import { AVAILABILITY_FIELDS } from "@/types";
import { profile } from "../__fixtures__/fixtures";

describe("VolunteerModal", () => {
  it("renders volunteer availability controls", () => {
    const { getByText } = render(
      <VolunteerModal
        modalVisible
        onModalVisible={jest.fn()}
        onHandleChange={jest.fn()}
        user={profile}
      />,
    );

    expect(getByText("Volunteer Status")).toBeTruthy();
    expect(getByText("Are you available to serve?")).toBeTruthy();
    expect(getByText("8:00 AM")).toBeTruthy();
    expect(getByText("9:30 AM")).toBeTruthy();
    expect(getByText("11:00 AM")).toBeTruthy();
  });

  it("reports changed availability fields", () => {
    const onHandleChange = jest.fn();

    const { UNSAFE_getAllByType } = render(
      <VolunteerModal
        modalVisible
        onModalVisible={jest.fn()}
        onHandleChange={onHandleChange}
        user={profile}
      />,
    );

    fireEvent(UNSAFE_getAllByType(Switch)[2], "valueChange", false);

    expect(onHandleChange).toHaveBeenCalledWith(
      AVAILABILITY_FIELDS.available_11am,
      false,
    );
  });
});
