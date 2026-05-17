import { Button } from "react-native";
import { supabase } from "@/utils/supabase";
import { useRouter } from "expo-router";
import { useSession } from "../providers/ctx";

const SignOut = () => {
  const router = useRouter();
  const { session, isLoading, signOut } = useSession();

  // const signOut = async () => {
  //   try {
  //     const { error } = await supabase.auth.signOut({ scope: "local" });
  //     if (error) throw new Error(error.message);
  //   } catch {
  //     console.log("Failed to sign out");
  //   } finally {
  //     router.push("/");
  //   }
  // };
  return <Button title="Sign Out" onPress={signOut} />;
};

export default SignOut;
