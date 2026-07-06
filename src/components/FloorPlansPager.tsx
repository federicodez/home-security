import { StyleSheet } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import FloorPlan from "./FloorPlan";
import type { AvailabilityField } from "@/types";

interface FloorPlansPagerProps {
  service: {
    id: string;
    name: string;
    availability_column?: AvailabilityField | string;
  };
}

export default function FloorPlansPager({
  service: { id, name, availability_column },
}: FloorPlansPagerProps) {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.centeredView}>
        <FloorPlan
          serviceId={id}
          serviceTime={name}
          serviceAvailabilityColumn={availability_column}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    width: "100%",
    backgroundColor: "#000",
    justifyContent: "center",
  },
});
