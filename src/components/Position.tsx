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
  if (user) {
    const name = getInitials(user.full_name?.toUpperCase());
    switch (station) {
      case "G":
        return (
          <G
            onPress={() => {
              onModalVisible(!modalVisible);
              onPosition(station);
            }}
            onLongPress={onClear}
          >
            {/* invisible hit target */}
            <Circle cx={x} cy={y} r={32} fill="transparent" />
            {/* outer station circle */}
            <Circle
              cx={x}
              cy={y}
              r={18}
              fill="#22C55E"
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
              fill="black"
            >
              {station}
            </Text>
            <Text
              x={x}
              y={y - 30}
              textAnchor="middle"
              fill="white"
              fontSize="18"
              fontWeight="bold"
            >
              {name}
            </Text>
          </G>
        );
      case "H":
        return (
          <G
            onPress={() => {
              onModalVisible(!modalVisible);
              onPosition(station);
            }}
            onLongPress={onClear}
          >
            {/* station letter */}
            <Text
              x={x}
              y={y}
              textAnchor="middle"
              alignmentBaseline="middle"
              fontSize="12"
              fontWeight="bold"
              fill="black"
            >
              {/* invisible hit target */}
              <Circle cx={x} cy={y} r={40} fill="transparent" />
              {/* outer station circle */}
              <Circle
                cx={x}
                cy={y}
                r={18}
                fill="#22C55E"
                stroke="white"
                strokeWidth={2}
              />
              {station}
            </Text>
            <Text
              x={x}
              y={y - 30}
              textAnchor="middle"
              fill="white"
              fontSize="18"
              fontWeight="bold"
            >
              <Circle cx={x} cy={y - 35} fill="black" r={15} opacity={0.9} />
              {name}
            </Text>
          </G>
        );
      case "E":
        return (
          <G
            onPress={() => {
              onModalVisible(!modalVisible);
              onPosition(station);
            }}
            onLongPress={onClear}
          >
            {/* station letter */}
            <Text
              x={x}
              y={y}
              textAnchor="middle"
              alignmentBaseline="middle"
              fontSize="12"
              fontWeight="bold"
              fill="black"
            >
              {/* invisible hit target */}
              <Circle cx={x} cy={y} r={32} fill="transparent" />
              {/* outer station circle */}
              <Circle
                cx={x}
                cy={y}
                r={18}
                fill="#22C55E"
                stroke="white"
                strokeWidth={2}
              />
              {station}
            </Text>
            <Text
              x={x}
              y={y - 30}
              textAnchor="middle"
              fill="white"
              fontSize="18"
              fontWeight="bold"
            >
              <Circle cx={x} cy={y - 35} fill="black" r={15} opacity={0.9} />
              {name}
            </Text>
          </G>
        );
      default:
        return (
          <G
            onPress={() => {
              onModalVisible(!modalVisible);
              onPosition(station);
            }}
            onLongPress={onClear}
          >
            {/* station letter */}
            <Text
              x={x}
              y={y}
              textAnchor="middle"
              alignmentBaseline="middle"
              fontSize="12"
              fontWeight="bold"
              fill="black"
            >
              {/* invisible hit target */}
              <Circle cx={x} cy={y} r={32} fill="transparent" />
              {/* outer station circle */}
              <Circle
                cx={x}
                cy={y}
                r={18}
                fill="#22C55E"
                stroke="white"
                strokeWidth={2}
              />
              {station}
            </Text>
            <Text
              x={x}
              y={y - 30}
              textAnchor="middle"
              fill="white"
              fontSize="18"
              fontWeight="bold"
            >
              <Circle cx={x} cy={y - 35} fill="black" r={15} opacity={0.9} />
              {name}
            </Text>
          </G>
        );
    }
  }

  return (
    <G
      onPress={() => {
        onModalVisible(!modalVisible);
        onPosition(station);
      }}
      onLongPress={onClear}
    >
      {/* invisible hit target */}
      <Circle cx={x} cy={y} r={32} fill="transparent" />
      {/* outer station circle */}
      <Circle
        cx={x}
        cy={y}
        r={18}
        fill="#374151"
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
        fill="white"
      >
        {station}
      </Text>
    </G>
  );
};

export default Position;
