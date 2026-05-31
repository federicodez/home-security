import { Pressable, View } from "react-native";

export default function PaginationDots({
  current,
  total,
  onDotPress,
}: {
  current: number;
  total: number;
  onDotPress: (index: number) => void;
}) {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 35,
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        gap: 10,
      }}
    >
      {Array.from({ length: total }).map((_, index) => (
        <Pressable
          key={index}
          onPress={() => onDotPress(index)}
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor:
              index === current ? "lime" : "rgba(255,255,255,0.35)",
          }}
        />
      ))}
    </View>
  );
}
