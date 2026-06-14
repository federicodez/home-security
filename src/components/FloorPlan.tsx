import { useState, useRef } from "react";
import { View } from "react-native";
import PagerView from "react-native-pager-view";

import { useUpdateAssignment, useAssignmentList } from "@/api/assignments";
import Main from "./Main";
import Outside from "./Outside";
import HomeKids from "./HomeKids";
import PaginationDots from "./PaginationDots";

interface FloorPlanProps {
  serviceId: string;
  serviceTime: string;
}

export default function FloorPlan({ serviceId, serviceTime }: FloorPlanProps) {
  const pagerRef = useRef<PagerView>(null);
  const [page, setPage] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [position, setPosition] = useState("");

  const { data: assignments } = useAssignmentList();
  const { mutate: updatePosition } = useUpdateAssignment();

  const handleAssign = (profileId: string) => {
    try {
      updatePosition({ serviceId, station: position, profileId });
    } catch {
      throw new Error("position update failed");
    } finally {
      setModalVisible(false);
    }
  };

  const handleClear = () =>
    updatePosition({ serviceId, station: position, profileId: null });

  return (
    <View style={{ flex: 1 }}>
      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={page}
        onPageSelected={(e) => setPage(e.nativeEvent.position)}
      >
        <View key="main" style={{ flex: 1 }}>
          <Main
            serviceTime={serviceTime}
            serviceId={serviceId}
            modalVisible={modalVisible}
            onModalVisible={setModalVisible}
            onAssign={handleAssign}
            onClear={handleClear}
            onPosition={setPosition}
            assignments={assignments}
          />
        </View>

        <View key="outside" style={{ flex: 1 }}>
          <Outside
            serviceTime={serviceTime}
            serviceId={serviceId}
            modalVisible={modalVisible}
            onModalVisible={setModalVisible}
            onAssign={handleAssign}
            onClear={handleClear}
            onPosition={setPosition}
            assignments={assignments}
          />
        </View>

        <View key="kids" style={{ flex: 1 }}>
          <HomeKids
            serviceTime={serviceTime}
            serviceId={serviceId}
            modalVisible={modalVisible}
            onModalVisible={setModalVisible}
            onAssign={handleAssign}
            onClear={handleClear}
            onPosition={setPosition}
            assignments={assignments}
          />
        </View>
      </PagerView>
      <PaginationDots
        current={page}
        total={3}
        onDotPress={(index) => {
          setPage(index);
          pagerRef.current?.setPage(index);
        }}
      />
    </View>
  );
}
