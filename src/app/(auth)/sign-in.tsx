import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useState } from "react";
import Button from "@/components/Button";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/utils/supabase";
import { defaultStyles } from "@/constants/Styles";

const OTP_LENGTH = 8;

const Login = () => {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);

  const [cooldown, setCooldown] = useState(0);
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedToken = token.trim();

  const sendOtp = async () => {
    if (cooldown > 0 || isSendingCode) return;

    try {
      setIsSendingCode(true);

      const { error } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          shouldCreateUser: false, // important for approved users only
        },
      });

      if (error) throw error;

      setCodeSent(true);
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
      setIsSendingCode(false);
    }
  };

  const verifyOtp = async () => {
    if (isVerifyingCode || normalizedToken.length < OTP_LENGTH) return;

    try {
      setIsVerifyingCode(true);

      const { data, error } = await supabase.auth.verifyOtp({
        email: normalizedEmail,
        token: normalizedToken,
        type: "email",
      });

      if (error) throw error;

      const user = data.user;

      if (!user) throw new Error("No user returned");
    } catch (error) {
      console.log(error);
      Alert.alert("Failed to verify code");
    } finally {
      setIsVerifyingCode(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          automaticallyAdjustKeyboardInsets
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Image
              source={require("assets/images/home_church.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>HOME CHURCH</Text>
            <Text style={styles.subtitle}>Security Team</Text>
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="jon@gmail.com"
              style={styles.input}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              textContentType="emailAddress"
            />

            {codeSent ? (
              <>
                <Text style={styles.label}>One time code</Text>
                <TextInput
                  keyboardType="numeric"
                  value={token}
                  onChangeText={setToken}
                  placeholder="12345678"
                  style={styles.input}
                  secureTextEntry
                />
                <Button
                  text={isVerifyingCode ? "Verifying..." : "Submit"}
                  onPress={verifyOtp}
                  disabled={
                    isVerifyingCode || normalizedToken.length < OTP_LENGTH
                  }
                />
              </>
            ) : (
              <Button
                text={
                  isSendingCode
                    ? "Sending..."
                    : cooldown > 0
                      ? `Resend in ${cooldown}s`
                      : "Send Code"
                }
                onPress={sendOtp}
                disabled={
                  isSendingCode ||
                  cooldown > 0 ||
                  !normalizedEmail.length
                }
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 32,
    paddingTop: 40,
  },

  header: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 15,
  },

  logo: {
    width: 120,
    height: 120,
  },

  title: {
    color: defaultStyles.primary,
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 2,
    marginTop: 12,
  },

  subtitle: {
    fontSize: 13,
    letterSpacing: 1,
    color: "#8A8A8A",
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 48,
  },

  formContainer: {
    width: "100%",
    backgroundColor: "#111111",
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: "rgba(212,190,143,0.55)",
    padding: 24,

    shadowColor: defaultStyles.primary,
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 6,
  },

  label: {
    color: defaultStyles.primary,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },

  input: {
    height: 56,
    backgroundColor: "#FFF",
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 18,
    fontSize: 16,
  },
});
export default Login;
