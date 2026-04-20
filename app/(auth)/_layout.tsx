import { Redirect, Stack, Slot } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";

const Authlayout = () => {
  const { session } = useAuth();
  return session ? <Redirect href={"/"} /> : <Stack />;
};

export default Authlayout;
