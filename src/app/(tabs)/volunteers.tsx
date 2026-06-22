import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  Pressable,
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
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import Availability from "@/components/Availability";
import VolunteerDetailsModal from "@/components/VolunteerDetailsModal";
import { defaultStyles } from "@/constants/Styles";

export default function Tab() {
  const [selectedVolunteer, setSelectedVolunteer] = useState<{
    full_name: string | null;
    assignedCount: number;
    services: {
      service_name: string | null;
      station: string | null;
    }[];
  } | null>(null);
  const { data: user } = useProfile();
  const { data: volunteers } = useVolunteerAssignments();
  const { mutate: updateAvailability } = useUpdateAvailability();

  const availableCount = [
    user?.available_8am,
    user?.available_930am,
    user?.available_11am,
  ].filter(Boolean).length;

  const userAssignments = volunteers?.find((v) => v.user_id === user?.id);

  const assigned8am = userAssignments?.services?.some(
    (s) => s.service_name === "8am" && s.station,
  );

  const assigned930am = userAssignments?.services?.some(
    (s) => s.service_name === "9:30am" && s.station,
  );

  const assigned11am = userAssignments?.services?.some(
    (s) => s.service_name === "11am" && s.station,
  );

  const closeVolunteerDetails = () => setSelectedVolunteer(null);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.screen}>
        <Image
          source={require("assets/images/home_church.png")}
          resizeMode="contain"
          style={styles.watermark}
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Roster</Text>
            <Text style={styles.subtitle}>Service assignments</Text>
          </View>

          <View style={styles.volunteersCard}>
            <View style={styles.volunteersHeader}>
              <Text style={styles.sectionTitle}>Volunteers</Text>
              <Text style={styles.helperText}>View details</Text>
            </View>

            {volunteers?.map(({ user_id, full_name, services }) => {
              const assignedCount =
                services?.filter((s) => s.station).length ?? 0;

              return (
                <Pressable
                  key={user_id}
                  style={styles.volunteerRow}
                  onPress={() =>
                    setSelectedVolunteer({
                      full_name,
                      assignedCount,
                      services,
                    })
                  }
                >
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {full_name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </Text>
                  </View>

                  <View style={styles.volunteerInfo}>
                    <Text style={styles.name}>{full_name?.toUpperCase()}</Text>
                    <Text style={styles.summary}>
                      {assignedCount} / 3 Services Assigned
                    </Text>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={24}
                    color={defaultStyles.primary}
                  />
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
        <VolunteerDetailsModal
          visible={!!selectedVolunteer}
          full_name={selectedVolunteer?.full_name ?? null}
          assignedCount={selectedVolunteer?.assignedCount ?? 0}
          services={selectedVolunteer?.services ?? []}
          onClose={closeVolunteerDetails}
        />
        <Availability
          user={user}
          assigned8am={assigned8am}
          assigned930am={assigned930am}
          assigned11am={assigned11am}
          availableCount={availableCount}
          onUpdateAvailability={updateAvailability}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

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
    padding: 8,
    marginBottom: 18,
  },

  title: {
    color: defaultStyles.primary,
    fontSize: 24,
    fontWeight: "800",
  },

  subtitle: {
    color: "#9CA3AF",
    fontSize: 16,
    marginTop: 4,
  },

  card: {
    backgroundColor: "#111111",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(212,190,143,0.4)",
    padding: 18,
    marginBottom: 18,
  },

  name: {
    color: defaultStyles.primary,
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
    color: defaultStyles.primary,
  },

  unassigned: {
    color: "#6B7280",
  },
  volunteersCard: {
    backgroundColor: "#111111",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(212,190,143,0.4)",
    padding: 18,
    marginBottom: 18,
  },

  volunteersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },

  sectionTitle: {
    color: defaultStyles.primary,
    fontSize: 18,
    fontWeight: "800",
  },

  helperText: {
    color: "#9CA3AF",
    fontSize: 13,
  },

  volunteerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: defaultStyles.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  avatarText: {
    color: defaultStyles.primary,
    fontSize: 16,
    fontWeight: "800",
  },

  volunteerInfo: {
    flex: 1,
  },

  summary: {
    color: "#9CA3AF",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 4,
  },
});
