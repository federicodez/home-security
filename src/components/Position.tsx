import { Circle, Text as SvgText } from "react-native-svg";
import type { UserRow } from "@/types";

interface PositionProps {
  user: UserRow | null;
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
    switch (station) {
      case "G":
        return (
          <>
            <SvgText
              x={x}
              y={y}
              fill="lime"
              fontSize="12"
              fontWeight="bold"
              transform={`rotate(20, ${x + 40}, ${y - 60})`}
            >
              {user.name.toUpperCase()}
            </SvgText>

            <Circle
              cx={x}
              cy={y}
              r="6"
              fill="lime"
              onPress={() => {
                onModalVisible(!modalVisible);
                onPosition(station);
              }}
              onLongPress={onClear}
            />
          </>
        );
      case "H":
        return (
          <>
            <SvgText
              x={x}
              y={y}
              fill="lime"
              fontSize="12"
              fontWeight="bold"
              transform={`rotate(20, ${x + 40}, ${y - 60})`}
            >
              {user.name.toUpperCase()}
            </SvgText>

            <Circle
              cx={x}
              cy={y}
              r="6"
              fill="lime"
              onPress={() => {
                onModalVisible(!modalVisible);
                onPosition(station);
              }}
              onLongPress={onClear}
            />
          </>
        );
      case "E":
        return (
          <>
            <SvgText
              x={x}
              y={y}
              fill="lime"
              fontSize="12"
              fontWeight="bold"
              transform={`rotate(-20, ${x - 20}, ${y + 10})`}
            >
              {user.name.toUpperCase()}
            </SvgText>

            <Circle
              cx={x}
              cy={y}
              r="6"
              fill="lime"
              onPress={() => {
                onModalVisible(!modalVisible);
                onPosition(station);
              }}
              onLongPress={onClear}
            />
          </>
        );
      default:
        return (
          <>
            <SvgText
              x={x - 10}
              y={y - 10}
              fill="lime"
              fontSize="12"
              fontWeight="bold"
            >
              {user.name.toUpperCase()}
            </SvgText>
            <Circle
              cx={x}
              cy={y}
              r="6"
              fill="lime"
              onPress={() => {
                onModalVisible(!modalVisible);
                onPosition(station);
              }}
              onLongPress={onClear}
            />
          </>
        );
    }
  }

  return (
    <Circle
      cx={x}
      cy={y}
      r="6"
      fill="lime"
      onPress={() => {
        onModalVisible(!modalVisible);
        onPosition(station);
      }}
    />
  );
};

export default Position;
