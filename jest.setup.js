jest.mock("@expo/vector-icons", () => {
  return {
    Ionicons: () => null,
    MaterialCommunityIcons: () => null,
    FontAwesome: {
      font: {},
    },
  };
});

jest.mock(
  "react-native-safe-area-context",
  () => require("react-native-safe-area-context/jest/mock").default,
);
