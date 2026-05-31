import {
  ImageBackground,
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import Button from "@/components/Button";
import Colors from "../../constants/Colors";
import { supabase } from "@/utils/supabase";
import * as WebBrowser from "expo-web-browser";
import {
  GoogleSigninButton,
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  iosClientId:
    "270094029822-51rsu9sts6poho93jupo2q9cjbatlo8v.apps.googleusercontent.com",
  webClientId:
    "270094029822-rp7h0961jabsivt3ksdihrtpkj8v05rj.apps.googleusercontent.com",
  scopes: ["https://www.googleapis.com/auth/drive.readonly"], // what API you want to access on behalf of the user, default is email and profile
});

WebBrowser.maybeCompleteAuthSession(); // required for web only

const Login = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState({
    first: "",
    last: "",
  });
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const [cooldown, setCooldown] = useState(0);

  const sendOtp = async () => {
    if (cooldown > 0) return;

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false, // important for approved users only
        },
      });

      if (error) throw error;

      setCooldown(60);

      const timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      console.log(error);

      if (error.message.includes("after")) {
        Alert.alert("Please wait", error.message);
        return;
      }

      Alert.alert("Failed to send code");
    } finally {
      setCodeSent(true);
    }
  };

  const verifyOtp = async () => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    if (error) throw error;

    const user = data.user;

    if (!user) throw new Error("No user returned");

    await supabase.from("profiles").upsert(
      {
        id: user.id,
        email: user.email,
        full_name: `${name.first} ${name.last}`,
        volunteering: false,
      },
      { onConflict: "id" },
    );
  };

  const signInWithGoogle = async () => {
    setLoading(true);

    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (userInfo.data?.idToken) {
        const { error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: userInfo.data.idToken,
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
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <ImageBackground
        source={require("assets/images/home_church.png")}
        resizeMode="repeat"
        style={{ flex: 1 }}
      >
        <View style={{ margin: "auto" }}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="jon@gmail.com"
            style={styles.input}
            autoCapitalize="none"
          />

          <Text style={styles.label}>First Name</Text>
          <TextInput
            value={name.first}
            onChangeText={(v) => setName((prev) => ({ ...prev, first: v }))}
            placeholder="jon"
            style={styles.input}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Last Name</Text>
          <TextInput
            value={name.last}
            onChangeText={(v) => setName((prev) => ({ ...prev, last: v }))}
            placeholder="Snow"
            style={styles.input}
            autoCapitalize="none"
          />

          {codeSent ? (
            <>
              <Text style={styles.label}>One time code</Text>
              <TextInput
                value={token}
                onChangeText={setToken}
                placeholder="*****"
                style={styles.input}
                secureTextEntry
              />
              <Button text="Submit" onPress={verifyOtp} />
            </>
          ) : (
            <Button
              text={cooldown > 0 ? `Resend in ${cooldown}s` : "Send Code"}
              onPress={sendOtp}
              disabled={
                cooldown > 0 ||
                !name.first.length ||
                !name.last.length ||
                !email.length
              }
            />
          )}

          <Text style={styles.textButton}>or</Text>
          <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={signInWithGoogle}
          />
        </View>
      </ImageBackground>
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
    color: Colors.light.tint,
    marginVertical: 10,
    fontSize: 20,
  },
});

export default Login;
