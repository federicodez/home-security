import { StyleSheet, View } from "react-native";
import {
  SafeAreaView,
  SafeAreaProvider,
} from "react-native-safe-area-context";
import FloorPlan from "./FloorPlan";
import ContextualHelp, { type HelpItem } from "./ContextualHelp";
import { useProfile } from "@/api/profiles";
import type { AvailabilityField } from "@/types";

interface FloorPlansPagerProps {
  service: {
    id: string;
    name: string;
    availability_column?: AvailabilityField | string;
  };
}

export default function FloorPlansPager({
  service,
}: FloorPlansPagerProps) {
  return (
    <SafeAreaProvider>
      <FloorPlansPagerContent service={service} />
    </SafeAreaProvider>
  );
}

function FloorPlansPagerContent({
  service: { id, name, availability_column },
}: FloorPlansPagerProps) {
  const { data: user } = useProfile();
  const canManageRoster = user?.role === "admin";
  const helpItems: HelpItem[] = canManageRoster
    ? [
        {
          icon: "map-outline",
          title: "Assign a position",
          body: "Tap any position on the map, then choose a volunteer from the assign list.",
        },
        {
          icon: "trash-outline",
          title: "Clear an assignment",
          body: "Tap an assigned position and use the clear action in the assign modal.",
        },
        {
          icon: "swap-horizontal-outline",
          title: "Switch map areas",
          body: "Swipe left or right, or use the page dots, to move between Main Sanctuary, Outside Grounds, and Home Kids.",
        },
      ]
    : [
        {
          icon: "checkmark-circle-outline",
          title: "Take a position",
          body: "Tap an open position, then confirm that you want to take it for this service.",
        },
        {
          icon: "close-circle-outline",
          title: "Remove yourself",
          body: "Tap your assigned position and use the remove action in the confirmation modal.",
        },
        {
          icon: "swap-horizontal-outline",
          title: "Switch map areas",
          body: "Swipe left or right, or use the page dots, to check positions in Main Sanctuary, Outside Grounds, and Home Kids.",
        },
      ];

  return (
    <SafeAreaView style={styles.centeredView}>
      <View style={styles.helpWrap}>
        <ContextualHelp
          subtitle={
            canManageRoster
              ? `Admin tools for the ${name} service map.`
              : `Volunteer tools for the ${name} service map.`
          }
          items={helpItems}
        />
      </View>
      <FloorPlan
        serviceId={id}
        serviceTime={name}
        serviceAvailabilityColumn={availability_column}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    width: "100%",
    backgroundColor: "#000",
    justifyContent: "center",
  },

  helpWrap: {
    position: "absolute",
    top: 38,
    right: 34,
    zIndex: 10,
  },
});
