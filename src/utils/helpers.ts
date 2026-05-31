import { Alert } from "react-native";
import { supabase } from "@/utils/supabase";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  webClientId:
    "270094029822-rp7h0961jabsivt3ksdihrtpkj8v05rj.apps.googleusercontent.com",
  iosClientId:
    "270094029822-51rsu9sts6poho93jupo2q9cjbatlo8v.apps.googleusercontent.com",
});

export const getInitials = (name?: string) =>
  `${name?.at(0)}${name?.split(" ").at(1)?.at(0)}`;

export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const { data } = await GoogleSignin.signIn();
    if (data?.idToken) {
      const { error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: data.idToken,
      });
      if (error) Alert.alert(error.message);
    } else {
      throw new Error("no ID token present!");
    }
  } catch (error: any) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      Alert.alert("Sign in was cancelled by user");
    } else if (error.code === statusCodes.IN_PROGRESS) {
      Alert.alert("Sign in is in progress already");
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      Alert.alert("Play services not available or outdated");
    } else {
      Alert.alert(error.message);
    }
  }
};
