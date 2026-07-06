import { Circle, G, Text } from "react-native-svg";
import { useRef } from "react";
import { defaultStyles } from "@/constants/Styles";
import { getInitials } from "@/utils/helpers";
import type { AssignmentWithRelations } from "@/types";

type StationProps = {
  serviceId: string;
  assignment: AssignmentWithRelations;
  modalVisible: boolean;
  onModalVisible: (modal: boolean) => void;
  onAssign: (profileId: string) => void;
  onClear: (station: string) => void;
  onPosition: (position: string) => void;
};

const HOLD_TO_CLEAR_DELAY_MS = 500;

export default function Station({
  assignment,
  modalVisible,
  onModalVisible,
  onClear,
  onPosition,
}: StationProps) {
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didHoldClear = useRef(false);
  const position = assignment.position;

  if (
    !position ||
    !Number.isFinite(position.x) ||
    !Number.isFinite(position.y)
  ) {
    return null;
  }

  const startHoldClear = (station: string) => {
    didHoldClear.current = false;
    if (holdTimer.current) clearTimeout(holdTimer.current);

    holdTimer.current = setTimeout(() => {
      didHoldClear.current = true;
      onClear(station);
    }, HOLD_TO_CLEAR_DELAY_MS);
  };

  const stopHoldClear = () => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  };

  const openAssignModal = (station: string) => {
    if (didHoldClear.current) {
      didHoldClear.current = false;
      return;
    }

    onModalVisible(!modalVisible);
    onPosition(station);
  };

  if (assignment.profile) {
    const name = getInitials(assignment.profile?.full_name?.toUpperCase());
    return (
      <G
        onPress={() => openAssignModal(position.station)}
        onPressIn={() => startHoldClear(position.station)}
        onPressOut={stopHoldClear}
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
      onPress={() => openAssignModal(assignment.station)}
      onPressIn={() => startHoldClear(assignment.station)}
      onPressOut={stopHoldClear}
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
