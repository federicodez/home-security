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
  if (assignment.profile) {
    const name = getInitials(assignment.profile?.full_name?.toUpperCase());
    return (
      <G
        onPress={() => {
          onModalVisible(!modalVisible);
          onPosition(assignment.position.station);
        }}
        onLongPress={onClear}
      >
        {/* station letter */}
        <Text
          x={assignment.position.x}
          y={assignment.position.y}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize="12"
          fontWeight="bold"
          fill={defaultStyles.secondary}
        >
          {/* invisible hit target */}
          <Circle
            cx={assignment.position.x}
            cy={assignment.position.y}
            r={32}
            fill="transparent"
          />
          {/* outer station circle */}
          <Circle
            cx={assignment.position.x}
            cy={assignment.position.y}
            r={18}
            fill={defaultStyles.primary}
            stroke={defaultStyles.lighter}
            strokeWidth={2}
          />
          {assignment.station}
        </Text>
        <Text
          x={assignment.position.x}
          y={assignment.position.y - 30}
          textAnchor="middle"
          fill={defaultStyles.lighter}
          fontSize="18"
          fontWeight="bold"
        >
          <Circle
            cx={assignment.position.x}
            cy={assignment.position.y - 35}
            fill={defaultStyles.secondary}
            r={15}
            opacity={0.9}
          />
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
        cx={assignment.position.x}
        cy={assignment.position.y}
        r={32}
        fill="transparent"
      />
      {/* outer station circle */}
      <Circle
        cx={assignment.position.x}
        cy={assignment.position.y}
        r={18}
        fill="#1F2937"
        stroke={defaultStyles.primary}
        strokeWidth={2}
      />

      {/* station letter */}
      <Text
        x={assignment.position.x}
        y={assignment.position.y}
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
