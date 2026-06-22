import { Pressable, StyleSheet, Text, View } from "react-native";
import { defaultStyles } from "@/constants/Styles";
import { forwardRef } from "react";

type ButtonProps = {
  text: string;
} & React.ComponentPropsWithoutRef<typeof Pressable>;

const Button = forwardRef<View | null, ButtonProps>(
  ({ text, ...pressableProps }, ref) => {
    return (
      <Pressable ref={ref} {...pressableProps} style={styles.container}>
        <Text style={styles.text}>{text}</Text>
      </Pressable>
    );
  },
);

Button.displayName = "Button";

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultStyles.primary,
    padding: 15,
    alignItems: "center",
    borderRadius: 100,
    marginVertical: 10,
    borderColor: defaultStyles.darker,
    borderWidth: 1,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    color: defaultStyles.secondary,
  },
});

export default Button;
