import { StyleSheet } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import FloorPlan from "./FloorPlan";

interface FloorPlansPagerProps {
  service: {
    id: string;
    name: string;
  };
}

export default function FloorPlansPager({
  service: { id, name },
}: FloorPlansPagerProps) {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.centeredView}>
        <FloorPlan serviceId={id} serviceTime={name} />
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
