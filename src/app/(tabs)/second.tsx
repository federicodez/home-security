import { ActivityIndicator } from "react-native";
import FloorPlansPager from "@/components/FloorPlansPager";
import { useGetServices } from "@/api/service";

export default function Tab() {
  const { data: services } = useGetServices();

  if (!services?.[1]) return <ActivityIndicator />;

  return <FloorPlansPager service={services?.[1]} />;
}
