import { View, Text, TextInput, StyleSheet, Alert, Button } from "react-native";
import React, { useState } from "react";
import { Link, Stack } from "expo-router";
import { supabase } from "@/utils/supabase";
import * as WebBrowser from "expo-web-browser";
import {
  GoogleSigninButton,
  GoogleSignin,
  isSuccessResponse,
  statusCodes,
  isErrorWithCode,
} from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  webClientId:
    "270094029822-rp7h0961jabsivt3ksdihrtpkj8v05rj.apps.googleusercontent.com",
  iosClientId:
    "270094029822-51rsu9sts6poho93jupo2q9cjbatlo8v.apps.googleusercontent.com",
});

WebBrowser.maybeCompleteAuthSession(); // required for web only

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  const signInWithGoogle = async () => {
    setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={signInWithGoogle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: "center",
    display: "flex",
  },
  label: {
    color: "gray",
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginTop: 5,
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 5,
  },
  textButton: {
    alignSelf: "center",
    fontWeight: "bold",
    marginVertical: 10,
  },
});

export default Login;
