import { Circle, Text, G } from "react-native-svg";
import type { ProfileRow } from "@/types";
import { getInitials } from "@/utils/helpers";

interface PositionProps {
  user: ProfileRow | null;
  station: string;
  x: number;
  y: number;
  modalVisible: boolean;
  onModalVisible: (value: boolean) => void;
  onPosition: (station: string) => void;
  onClear: () => void;
}

const Position = ({
  user,
  station,
  x,
  y,
  modalVisible,
  onModalVisible,
  onPosition,
  onClear,
}: PositionProps) => {
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return null;
  }

  const assigned = !!user;
  const initials = user ? getInitials(user.full_name?.toUpperCase()) : null;
  const hitRadius = assigned && station === "H" ? 40 : 32;
  const showNameBadge = assigned && station !== "G";

  return (
    <G
      onPress={() => {
        onModalVisible(!modalVisible);
        onPosition(station);
      }}
      onLongPress={onClear}
    >
      {/* invisible hit target */}
      <Circle cx={x} cy={y} r={hitRadius} fill="transparent" />
      {/* outer station circle */}
      <Circle
        cx={x}
        cy={y}
        r={18}
        fill={assigned ? "#22C55E" : "#374151"}
        stroke="white"
        strokeWidth={2}
      />

      {/* station letter */}
      <Text
        x={x}
        y={y}
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize="12"
        fontWeight="bold"
        fill={assigned ? "black" : "white"}
      >
        {station}
      </Text>

      {showNameBadge && (
        <Circle cx={x} cy={y - 35} fill="black" r={15} opacity={0.9} />
      )}

      {initials && (
        <Text
          x={x}
          y={y - 30}
          textAnchor="middle"
          fill="white"
          fontSize="18"
          fontWeight="bold"
        >
          {initials}
        </Text>
      )}
    </G>
  );
};

export default Position;
