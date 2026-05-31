import FloorPlansPager from "@/components/FloorPlansPager";
import { useGetServices } from "@/api/service";

export default function Tab() {
  const { data: services } = useGetServices();

  return <FloorPlansPager serviceId={services?.at(0).id} />;
}
