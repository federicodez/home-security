import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { defaultStyles } from "@/constants/Styles";

export type HelpItem = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
};

type ContextualHelpProps = {
  title?: string;
  subtitle: string;
  items: HelpItem[];
};

export default function ContextualHelp({
  title = "How It Works",
  subtitle,
  items,
}: ContextualHelpProps) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open help"
        style={styles.helpButton}
        onPress={() => setVisible(true)}
      >
        <Ionicons
          name="help-circle-outline"
          size={20}
          color={defaultStyles.primary}
        />
      </Pressable>

      <Modal
        animationType="slide"
        transparent
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContainer}>
                <View style={styles.modalHandle} />
                <Text style={styles.modalTitle}>{title}</Text>
                <Text style={styles.modalSubtitle}>{subtitle}</Text>

                {items.map((item) => (
                  <View key={item.title} style={styles.helpItem}>
                    <View style={styles.helpIcon}>
                      <Ionicons
                        name={item.icon}
                        size={20}
                        color={defaultStyles.primary}
                      />
                    </View>
                    <View style={styles.helpCopy}>
                      <Text style={styles.helpTitle}>{item.title}</Text>
                      <Text style={styles.helpBody}>{item.body}</Text>
                    </View>
                  </View>
                ))}

                <Pressable
                  style={styles.cancelButton}
                  onPress={() => setVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Done</Text>
                </Pressable>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  helpButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    width: 40,
    height: 40,
    justifyContent: "center",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.72)",
  },

  modalContainer: {
    backgroundColor: "#0A0A0A",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(212,190,143,0.45)",
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 34,
  },

  modalHandle: {
    width: 42,
    height: 5,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignSelf: "center",
    marginBottom: 18,
  },

  modalTitle: {
    color: defaultStyles.primary,
    fontSize: 26,
    fontWeight: "800",
  },

  modalSubtitle: {
    color: "#9CA3AF",
    fontSize: 15,
    lineHeight: 21,
    marginTop: 6,
    marginBottom: 18,
  },

  helpItem: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
  },

  helpIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(212,190,143,0.1)",
  },

  helpCopy: {
    flex: 1,
  },

  helpTitle: {
    color: "#E5E7EB",
    fontSize: 16,
    fontWeight: "800",
  },

  helpBody: {
    color: "#9CA3AF",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 3,
  },

  cancelButton: {
    height: 50,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(212,190,143,0.12)",
    borderWidth: 1,
    borderColor: "rgba(212,190,143,0.35)",
    marginTop: 18,
  },

  cancelButtonText: {
    color: defaultStyles.primary,
    fontSize: 16,
    fontWeight: "800",
  },
});
