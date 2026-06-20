import { Dimensions, FlatList, View, StyleSheet } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import FloorPlan from "./FloorPlan";

const { width } = Dimensions.get("window");

const floorPlans = [
  { id: "main", title: "Main Sanctuary" },
  { id: "outside", title: "Outside" },
  { id: "kids", title: "Kids" },
];

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
        <FlatList
          data={floorPlans}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={() => (
            <View style={{ width, flex: 1, backgroundColor: "black" }}>
              <FloorPlan serviceId={id} serviceTime={name} />
            </View>
          )}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
});
