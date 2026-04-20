import { TextInput, StyleSheet, Alert } from "react-native";
import React, { useState } from "react";
import { HStack, Host, Button, Text } from "@expo/ui/swift-ui";
import { Link, Stack } from "expo-router";
import { supabase } from "@/lib/supabase";
// import {
//   GoogleSigninButton,
// } from "@react-native-google-signin/google-signin";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //const [loading, setLoading] = useState(false);

  // async function signInWithEmail() {
  //   setLoading(true);
  //   const { error } = await supabase.auth.signInWithPassword({
  //     email,
  //     password,
  //   });
  //
  //   if (error) Alert.alert(error.message);
  //   setLoading(false);
  // }
  //
  // const signInWithGoogle = async () => {
  //   setLoading(true);
  //
  //   try {
  //     await GoogleSignin.hasPlayServices();
  //     const userInfo = await GoogleSignin.signIn();
  //     if (userInfo.data?.idToken) {
  //       const { error } = await supabase.auth.signInWithIdToken({
  //         provider: "google",
  //         token: userInfo.data.idToken,
  //       });
  //       if (error) Alert.alert(error.message);
  //     } else {
  //       throw new Error("no ID token present!");
  //     }
  //   } catch (error: any) {
  //     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
  //       Alert.alert("Sign in was cancelled by user");
  //     } else if (error.code === statusCodes.IN_PROGRESS) {
  //       Alert.alert("Sign in is in progress already");
  //     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
  //       Alert.alert("Play services not available or outdated");
  //     } else {
  //       Alert.alert(error.message);
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <Host style={styles.container}>
      <Stack.Screen options={{ title: "Sign in" }} />

      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="jon@gmail.com"
        style={styles.input}
        autoCapitalize="none"
      />

      <Text>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="*****"
        style={styles.input}
        secureTextEntry
      />

      <Button
        onPress={() => console.log()}
      >
        <HStack>
          <Link href="/register" style={styles.textButton}>
            Create an account
          </Link>
        </HStack>
      </Button>
    </Host>
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

