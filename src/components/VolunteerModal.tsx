import { Modal, StyleSheet, Switch, View, Text, Pressable } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import type { ProfileRow, AvailabilityField } from "@/types";
import { AVAILABILITY_FIELDS } from "@/types";

const GOLD = "#D4BE8C";

interface VolunteerModalProps {
  modalVisible: boolean;
  onModalVisible: (visible: boolean) => void;
  onHandleChange: (service: AvailabilityField, availability: boolean) => void;
  user?: ProfileRow | null;
}

export default function VolunteerModal({
  modalVisible,
  onModalVisible,
  onHandleChange,
  user,
}: VolunteerModalProps) {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={modalVisible}
      onRequestClose={() => onModalVisible(false)}
    >
      <Pressable
        style={styles.modalOverlay}
        onPress={() => onModalVisible(false)}
      >
        <Pressable style={styles.modalContainer} onPress={() => {}}>
          <Text style={styles.title}>Volunteer Status</Text>
          <Text style={styles.subtitle}>Are you available to serve?</Text>

          <View style={styles.serviceRow}>
            <Text style={styles.serviceLabel}>8:00 AM</Text>
            <Switch
              value={user?.available_8am ?? false}
              onValueChange={(service8) =>
                onHandleChange(AVAILABILITY_FIELDS.available_8am, service8)
              }
              trackColor={{ false: "#333", true: "#D4BE8C" }}
            />
          </View>

          <View style={styles.serviceRow}>
            <Text style={styles.serviceLabel}>9:30 AM</Text>
            <Switch
              value={user?.available_930am ?? false}
              onValueChange={(service8) =>
                onHandleChange(AVAILABILITY_FIELDS.available_930am, service8)
              }
              trackColor={{ false: "#333", true: "#D4BE8C" }}
            />
          </View>

          <View style={styles.serviceRow}>
            <Text style={styles.serviceLabel}>11:00 AM</Text>
            <Switch
              value={user?.available_11am ?? false}
              onValueChange={(service8) =>
                onHandleChange(AVAILABILITY_FIELDS.available_11am, service8)
              }
              trackColor={{ false: "#333", true: "#D4BE8C" }}
            />
          </View>
        </Pressable>
      </Pressable>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.72)",
  },

  modalContainer: {
    width: "86%",
    backgroundColor: "#0A0A0A",
    borderColor: GOLD,
    borderWidth: 1,
    borderRadius: 24,
    padding: 22,
  },

  title: {
    color: GOLD,
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
  },

  subtitle: {
    color: "#9CA3AF",
    fontSize: 15,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 22,
  },

  toggleRow: {
    flexDirection: "row",
    backgroundColor: "#111111",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(212,190,140,0.35)",
    padding: 5,
  },

  toggleOption: {
    flex: 1,
    height: 54,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  activeOption: {
    backgroundColor: GOLD,
  },

  activeText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "800",
  },

  inactiveText: {
    color: GOLD,
    fontSize: 16,
    fontWeight: "800",
  },
  serviceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(212,190,140,0.15)",
  },

  serviceLabel: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
