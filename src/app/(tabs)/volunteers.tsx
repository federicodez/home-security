import { Ionicons } from "@expo/vector-icons";
import {
  Switch,
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
} from "react-native";
import {
  useVolunteerAssignments,
  useProfile,
  useUpdateAvailability,
} from "@/api/profiles";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Tab() {
  const { data: user } = useProfile();
  const { data: volunteers } = useVolunteerAssignments();
  const { mutate: updateAvailability } = useUpdateAvailability();

  const availableCount = [
    user?.available_8am,
    user?.available_930am,
    user?.available_11am,
  ].filter(Boolean).length;

  return (
    <SafeAreaView style={styles.screen}>
      <Image
        source={require("assets/images/home_church.png")}
        resizeMode="contain"
        style={styles.watermark}
      />

      <View style={styles.header}>
        <Text style={styles.title}>Roster</Text>
        <Text style={styles.subtitle}>Service assignments</Text>
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {volunteers?.map(({ user_id, full_name, services }) => (
          <View key={user_id} style={styles.card}>
            <Text style={styles.name}>{full_name?.toUpperCase()}</Text>

            {services.map(({ station, service_name }) => (
              <View key={service_name} style={styles.assignmentRow}>
                <Text style={styles.service}>{service_name}</Text>
                <Text
                  style={[
                    styles.station,
                    station ? styles.assigned : styles.unassigned,
                  ]}
                >
                  {station ? `Station ${station}` : "Unassigned"}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

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
            value={user?.available_8am ?? false}
            onValueChange={(value) =>
              updateAvailability({ available_8am: value })
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
            value={user?.available_930am ?? false}
            onValueChange={(value) =>
              updateAvailability({ available_930am: value })
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
            value={user?.available_11am ?? false}
            onValueChange={(value) =>
              updateAvailability({ available_11am: value })
            }
            trackColor={{
              false: "#3A3A3A",
              true: "#22C55E",
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const GOLD = "#D4BE8F";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
  },

  watermark: {
    position: "absolute",
    width: "90%",
    height: "90%",
    left: "5%",
    top: "8%",
    opacity: 0.04,
  },

  header: {
    backgroundColor: "rgba(17,17,17,0.96)",
    borderWidth: 1,
    borderColor: "rgba(212,190,143,0.55)",
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
  },

  title: {
    color: GOLD,
    fontSize: 34,
    fontWeight: "800",
  },

  subtitle: {
    color: "#9CA3AF",
    fontSize: 16,
    marginTop: 4,
  },

  list: {
    flex: 1,
  },

  listContent: {
    paddingBottom: 20,
  },

  card: {
    backgroundColor: "#111111",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(212,190,143,0.4)",
    padding: 18,
  },

  name: {
    color: GOLD,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
  },

  assignmentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
  },

  service: {
    color: "#E5E7EB",
    fontSize: 16,
    fontWeight: "700",
  },

  station: {
    fontSize: 16,
    fontWeight: "700",
  },

  assigned: {
    color: GOLD,
  },

  unassigned: {
    color: "#6B7280",
  },

  footer: {
    paddingTop: 12,
    paddingBottom: 12,
  },
  availabilityCard: {
    backgroundColor: "#0A0A0A",
    borderWidth: 1,
    borderColor: "#D4BE8C55",
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 24,
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
    color: "#D4BE8C",
    fontWeight: "600",
  },

  onText: {
    color: "#22C55E",
    fontSize: 18,
    fontWeight: "700",
  },

  offText: {
    color: "#6B7280",
    fontSize: 18,
    fontWeight: "700",
  },
});
