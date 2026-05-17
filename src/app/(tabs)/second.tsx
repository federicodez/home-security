import { useAuth } from "@/providers/AuthProvider";
import { Redirect } from "expo-router";
import FloorPlan from "@/components/FloorPlan";
import { useGetServices } from "@/api/service";

export default function Page() {
  const { session } = useAuth();
  const { data } = useGetServices();

  if (!session) return <Redirect href={"/(auth)/login"} />;

  return <FloorPlan serviceId={data?.at(1)?.id} />;
}
