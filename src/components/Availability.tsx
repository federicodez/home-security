import { Switch, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { ProfileRow, AvailabilityUpdate } from "@/types";
import { defaultStyles } from "@/constants/Styles";

interface AvailabilityProps {
  user?: ProfileRow | null;
  assigned8am?: boolean;
  assigned930am?: boolean;
  assigned11am?: boolean;
  availableCount: number;
  onUpdateAvailability: (values: AvailabilityUpdate) => void;
}

const Availability = ({
  user,
  assigned8am,
  assigned930am,
  assigned11am,
  availableCount,
  onUpdateAvailability,
}: AvailabilityProps) => {
  return (
    <View style={styles.availabilityCard}>
      <Text style={styles.availabilityTitle}>Service Availability</Text>
      <Text style={styles.subtitle}>
        {availableCount} / 3 Services Available
      </Text>

      <View style={styles.availabilityRow}>
        <Text
          style={[
            styles.serviceLabel,
            { opacity: user?.available_8am ? 1 : 0.5 },
          ]}
        >
          <Ionicons name="shield-outline" size={20} color="#D4BE8C" />
          8:00 AM
        </Text>

        <Switch
          disabled={assigned8am}
          value={user?.available_8am ?? false}
          onValueChange={(value) =>
            onUpdateAvailability({ available_8am: value })
          }
          trackColor={{
            false: "#3A3A3A",
            true: "#22C55E",
          }}
        />
      </View>

      <View style={styles.availabilityRow}>
        <Text
          style={[
            styles.serviceLabel,
            { opacity: user?.available_930am ? 1 : 0.5 },
          ]}
        >
          <Ionicons name="shield-outline" size={20} color="#D4BE8C" />
          9:30 AM
        </Text>

        <Switch
          disabled={assigned930am}
          value={user?.available_930am ?? false}
          onValueChange={(value) =>
            onUpdateAvailability({ available_930am: value })
          }
          trackColor={{
            false: "#3A3A3A",
            true: "#22C55E",
          }}
        />
      </View>

      <View style={styles.availabilityRow}>
        <Text
          style={[
            styles.serviceLabel,
            { opacity: user?.available_11am ? 1 : 0.5 },
          ]}
        >
          <Ionicons name="shield-outline" size={20} color="#D4BE8C" />
          11:00 AM
        </Text>

        <Switch
          disabled={assigned11am}
          value={user?.available_11am ?? false}
          onValueChange={(value) =>
            onUpdateAvailability({ available_11am: value })
          }
          trackColor={{
            false: "#3A3A3A",
            true: "#22C55E",
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    color: "#9CA3AF",
    fontSize: 16,
    marginTop: 4,
  },

  availabilityCard: {
    backgroundColor: "#0A0A0A",
    borderWidth: 1,
    borderColor: "#D4BE8C55",
    borderRadius: 24,
    padding: 24,
    marginBottom: 18,
    fontSize: 18,
    fontWeight: "700",
  },

  availabilityTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#A0A3B1",
    marginBottom: 16,
    textAlign: "center",
  },

  availabilityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },

  serviceLabel: {
    fontSize: 18,
    color: defaultStyles.primary,
    fontWeight: "600",
  },
});

export default Availability;
