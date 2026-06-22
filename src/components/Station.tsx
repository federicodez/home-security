import { Circle, G, Text } from "react-native-svg";
import { defaultStyles } from "@/constants/Styles";
import { getInitials } from "@/utils/helpers";
import type { AssignmentWithRelations } from "@/types";

type StationProps = {
  serviceId: string;
  assignment: AssignmentWithRelations;
  modalVisible: boolean;
  onModalVisible: (modal: boolean) => void;
  onAssign: (profileId: string) => void;
  onClear: () => void;
  onPosition: (position: string) => void;
};

export default function Station({
  assignment,
  modalVisible,
  onModalVisible,
  onClear,
  onPosition,
}: StationProps) {
  const position = assignment.position;

  if (
    !position ||
    !Number.isFinite(position.x) ||
    !Number.isFinite(position.y)
  ) {
    return null;
  }

  if (assignment.profile) {
    const name = getInitials(assignment.profile?.full_name?.toUpperCase());
    return (
      <G
        onPress={() => {
          onModalVisible(!modalVisible);
          onPosition(position.station);
        }}
        onLongPress={onClear}
      >
        {/* invisible hit target */}
        <Circle cx={position.x} cy={position.y} r={32} fill="transparent" />
        {/* outer station circle */}
        <Circle
          cx={position.x}
          cy={position.y}
          r={18}
          fill={defaultStyles.primary}
          stroke={defaultStyles.lighter}
          strokeWidth={2}
        />
        {/* station letter */}
        <Text
          x={position.x}
          y={position.y}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize="12"
          fontWeight="bold"
          fill={defaultStyles.secondary}
        >
          {assignment.station}
        </Text>
        <Circle
          cx={position.x}
          cy={position.y - 35}
          fill={defaultStyles.secondary}
          r={15}
          opacity={0.9}
        />
        <Text
          x={position.x}
          y={position.y - 30}
          textAnchor="middle"
          fill={defaultStyles.lighter}
          fontSize="18"
          fontWeight="bold"
        >
          {name}
        </Text>
      </G>
    );
  }
  return (
    <G
      onPress={() => {
        onModalVisible(!modalVisible);
        onPosition(assignment.station);
      }}
      onLongPress={onClear}
    >
      {/* invisible hit target */}
      <Circle
        cx={position.x}
        cy={position.y}
        r={32}
        fill="transparent"
      />
      {/* outer station circle */}
      <Circle
        cx={position.x}
        cy={position.y}
        r={18}
        fill="#1F2937"
        stroke={defaultStyles.primary}
        strokeWidth={2}
      />

      {/* station letter */}
      <Text
        x={position.x}
        y={position.y}
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize="12"
        fontWeight="bold"
        fill={defaultStyles.lighter}
      >
        {assignment.station}
      </Text>
    </G>
  );
}
