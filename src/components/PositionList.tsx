import { G } from "react-native-svg";
import Station from "./Station";
import type { AssignmentWithRelations } from "@/types";

interface PositionListProps {
  serviceId: string;
  modalVisible: boolean;
  onModalVisible: (modal: boolean) => void;
  onAssign: (profileId: string) => void;
  onClear: () => void;
  onPosition: (position: string) => void;
  assignments?: AssignmentWithRelations[];
}

const PositionList = ({
  serviceId,
  modalVisible,
  onModalVisible,
  onAssign,
  onClear,
  onPosition,
  assignments,
}: PositionListProps) =>
  assignments
    ?.filter(({ service: { id } }) => id === serviceId)
    .filter(({ station }) => !["O1", "O2", "K"].includes(station))
    .map((assignment) => (
      <G key={assignment.id}>
        <Station
          assignment={assignment}
          serviceId={serviceId}
          modalVisible={modalVisible}
          onAssign={onAssign}
          onClear={onClear}
          onPosition={onPosition}
          onModalVisible={onModalVisible}
        />
      </G>
    ));

export default PositionList;
