/* eslint-disable @typescript-eslint/no-require-imports */
import { render } from "@testing-library/react-native";
import { ActivityIndicator } from "react-native";
import EightAmTab from "../index";
import NineThirtyTab from "../second";
import ElevenAmTab from "../third";
import { useGetServices } from "@/api/service";

jest.mock("@/api/service", () => ({
  useGetServices: jest.fn(),
}));

jest.mock("@/components/FloorPlansPager", () => {
  const React = require("react");
  const { Text } = require("react-native");

  return function MockFloorPlansPager({ service }: { service: { name: string } }) {
    return React.createElement(Text, null, service.name);
  };
});

const mockUseGetServices = jest.mocked(useGetServices);

const services = [
  { id: "service-8", name: "8am" },
  { id: "service-930", name: "9:30am" },
  { id: "service-11", name: "11am" },
];

describe("service tabs", () => {
  beforeEach(() => {
    mockUseGetServices.mockReturnValue({ data: services } as ReturnType<
      typeof useGetServices
    >);
  });

  it("passes the first service to the 8 AM floor plan", () => {
    const { getByText } = render(<EightAmTab />);

    expect(getByText("8am")).toBeTruthy();
  });

  it("passes the second service to the 9:30 floor plan", () => {
    const { getByText } = render(<NineThirtyTab />);

    expect(getByText("9:30am")).toBeTruthy();
  });

  it("passes the third service to the 11 AM floor plan", () => {
    const { getByText } = render(<ElevenAmTab />);

    expect(getByText("11am")).toBeTruthy();
  });

  it("shows a loading indicator when the selected service is missing", () => {
    mockUseGetServices.mockReturnValue(
      { data: [] } as unknown as ReturnType<typeof useGetServices>,
    );

    const { UNSAFE_getByType } = render(<EightAmTab />);

    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });
});
