import {
  ImageBackground,
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useState } from "react";
import Button from "@/components/Button";
import { supabase } from "@/utils/supabase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState({
    first: "",
    last: "",
  });
  const [token, setToken] = useState("");
  const [codeSent, setCodeSent] = useState(false);

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

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("assets/images/home_church.png")}
        resizeMode="repeat"
        style={styles.container}
      >
        <View style={styles.formContainer}>
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
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  formContainer: {
    width: "90%",
    margin: "auto",
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
});

export default Login;
