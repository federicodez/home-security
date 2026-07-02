import { useEffect, useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  Pressable,
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  Alert,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import {
  useVolunteerAssignments,
  useProfile,
  useUpdateAvailability,
  useUpdateProfile,
  usePositionPreferences,
  useUpdatePositionPreferences,
  useInviteVolunteer,
} from "@/api/profiles";
import { usePositionList } from "@/api/positions";
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
  const [fullName, setFullName] = useState("");
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteFullName, setInviteFullName] = useState("");
  const [rankedStations, setRankedStations] = useState<string[]>([]);
  const { data: user } = useProfile();
  const { data: volunteers } = useVolunteerAssignments();
  const { data: positions } = usePositionList();
  const { data: positionPreferences } = usePositionPreferences();
  const { mutate: updateAvailability } = useUpdateAvailability();
  const { mutate: updateProfile, isPending: isUpdatingProfile } =
    useUpdateProfile();
  const {
    mutate: updatePositionPreferences,
    isPending: isUpdatingPositionPreferences,
  } = useUpdatePositionPreferences();
  const { mutate: inviteVolunteer, isPending: isInvitingVolunteer } =
    useInviteVolunteer();

  const positionStations = useMemo(
    () =>
      Array.from(
        new Set((positions ?? []).map((position) => position.station)),
      ).filter((station): station is string => !!station),
    [positions],
  );

  const savedRankedStations = useMemo(() => {
    const preferredStations = [...(positionPreferences ?? [])]
      .sort((a, b) => a.rank - b.rank)
      .map((preference) => preference.station)
      .filter((station) => positionStations.includes(station));
    const remainingStations = positionStations.filter(
      (station) => !preferredStations.includes(station),
    );

    return [...preferredStations, ...remainingStations];
  }, [positionPreferences, positionStations]);

  useEffect(() => {
    setFullName(user?.full_name ?? "");
  }, [user?.full_name]);

  useEffect(() => {
    setRankedStations(savedRankedStations);
  }, [savedRankedStations]);

  const trimmedFullName = fullName.trim();
  const isProfileIncomplete = !user?.full_name?.trim();
  const canSaveProfile =
    isProfileIncomplete && !!trimmedFullName && !isUpdatingProfile;
  const hasPreferenceChanges =
    rankedStations.length === savedRankedStations.length &&
    rankedStations.some((station, index) => station !== savedRankedStations[index]);
  const canSavePreferences =
    hasPreferenceChanges && !isUpdatingPositionPreferences;
  const normalizedInviteEmail = inviteEmail.trim().toLowerCase();
  const trimmedInviteFullName = inviteFullName.trim();
  const canInviteVolunteer =
    !!normalizedInviteEmail && !!trimmedInviteFullName && !isInvitingVolunteer;

  const saveProfile = () => {
    if (!canSaveProfile) return;

    updateProfile(
      { full_name: trimmedFullName },
      {
        onError: () => {
          Alert.alert("Failed to save name");
        },
      },
    );
  };

  const moveStation = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;

    if (nextIndex < 0 || nextIndex >= rankedStations.length) return;

    setRankedStations((current) => {
      const next = [...current];
      const movedStation = next[index];

      next[index] = next[nextIndex];
      next[nextIndex] = movedStation;

      return next;
    });
  };

  const savePositionPreferences = () => {
    if (!canSavePreferences) return;

    updatePositionPreferences(
      { stations: rankedStations },
      {
        onError: () => {
          Alert.alert("Failed to save preferences");
        },
      },
    );
  };

  const closeInviteModal = () => {
    if (isInvitingVolunteer) return;

    setInviteModalVisible(false);
    setInviteEmail("");
    setInviteFullName("");
  };

  const submitInvite = () => {
    if (!canInviteVolunteer) return;

    inviteVolunteer(
      {
        email: normalizedInviteEmail,
        full_name: trimmedInviteFullName,
        role: "volunteer",
      },
      {
        onSuccess: () => {
          Alert.alert("Invite sent");
          closeInviteModal();
        },
        onError: (error) => {
          Alert.alert(
            "Failed to invite volunteer",
            error instanceof Error ? error.message : undefined,
          );
        },
      },
    );
  };

  const availableCount = [
    user?.available_8am,
    user?.available_930am,
    user?.available_11am,
  ].filter(Boolean).length;

  const userAssignments = volunteers?.find((v) => v.user_id === user?.id);
  const canManageRoster = user?.role === "admin";

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
          <Availability
            user={user}
            assigned8am={assigned8am}
            assigned930am={assigned930am}
            assigned11am={assigned11am}
            availableCount={availableCount}
            onUpdateAvailability={updateAvailability}
          />

          {isProfileIncomplete ? (
            <View style={styles.profileCard}>
              <View style={styles.volunteersHeader}>
                <Text style={styles.sectionTitle}>Complete Profile</Text>
                <Text style={styles.helperText}>Name required</Text>
              </View>

              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Your full name"
                style={styles.profileInput}
                autoCapitalize="words"
                autoComplete="name"
                textContentType="name"
                placeholderTextColor="#6B7280"
                returnKeyType="done"
                onSubmitEditing={saveProfile}
              />

              <Pressable
                style={[
                  styles.saveButton,
                  !canSaveProfile && styles.disabledButton,
                ]}
                disabled={!canSaveProfile}
                onPress={saveProfile}
              >
                <Text style={styles.saveButtonText}>
                  {isUpdatingProfile ? "Saving..." : "Save Name"}
                </Text>
              </Pressable>
            </View>
          ) : null}

          {rankedStations.length > 0 ? (
            <View style={styles.preferencesCard}>
              <View style={styles.volunteersHeader}>
                <Text style={styles.sectionTitle}>Position Preferences</Text>
                <Text style={styles.helperText}>Ranked</Text>
              </View>

              {rankedStations.map((station, index) => (
                <View key={station} style={styles.preferenceRow}>
                  <View style={styles.rankBadge}>
                    <Text style={styles.rankText}>{index + 1}</Text>
                  </View>

                  <Text style={styles.preferenceStation}>{station}</Text>

                  <View style={styles.rankActions}>
                    <Pressable
                      accessibilityLabel={`Move ${station} up`}
                      disabled={index === 0}
                      onPress={() => moveStation(index, -1)}
                      style={[
                        styles.rankButton,
                        index === 0 && styles.disabledButton,
                      ]}
                    >
                      <Ionicons
                        name="chevron-up"
                        size={20}
                        color={defaultStyles.primary}
                      />
                    </Pressable>

                    <Pressable
                      accessibilityLabel={`Move ${station} down`}
                      disabled={index === rankedStations.length - 1}
                      onPress={() => moveStation(index, 1)}
                      style={[
                        styles.rankButton,
                        index === rankedStations.length - 1 &&
                          styles.disabledButton,
                      ]}
                    >
                      <Ionicons
                        name="chevron-down"
                        size={20}
                        color={defaultStyles.primary}
                      />
                    </Pressable>
                  </View>
                </View>
              ))}

              <Pressable
                style={[
                  styles.saveButton,
                  !canSavePreferences && styles.disabledButton,
                ]}
                disabled={!canSavePreferences}
                onPress={savePositionPreferences}
              >
                <Text style={styles.saveButtonText}>
                  {isUpdatingPositionPreferences
                    ? "Saving..."
                    : "Save Preferences"}
                </Text>
              </Pressable>
            </View>
          ) : null}

          {!canManageRoster ? (
            <View style={styles.assignmentsCard}>
              <View style={styles.volunteersHeader}>
                <Text style={styles.sectionTitle}>Your Assignments</Text>
                <Text style={styles.helperText}>
                  {userAssignments?.services?.filter((service) => service.station)
                    .length ?? 0}{" "}
                  assigned
                </Text>
              </View>

              {userAssignments?.services?.some((service) => service.station) ? (
                userAssignments.services
                  .filter((service) => service.station)
                  .map((service) => (
                    <View
                      key={`${service.service_name}-${service.station}`}
                      style={styles.assignmentRow}
                    >
                      <Text style={styles.service}>
                        {service.service_name ?? "Service"}
                      </Text>
                      <Text style={[styles.station, styles.assigned]}>
                        Station {service.station}
                      </Text>
                    </View>
                  ))
              ) : (
                <Text style={styles.emptyText}>No assignments yet</Text>
              )}
            </View>
          ) : null}

          {canManageRoster ? (
            <View style={styles.volunteersCard}>
              <View style={styles.volunteersHeader}>
                <Text style={styles.sectionTitle}>Volunteers</Text>
                <Pressable
                  style={styles.inviteButton}
                  onPress={() => setInviteModalVisible(true)}
                >
                  <Ionicons
                    name="person-add-outline"
                    size={18}
                    color={defaultStyles.secondary}
                  />
                  <Text style={styles.inviteButtonText}>Invite</Text>
                </Pressable>
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
                      <Text style={styles.name}>
                        {full_name?.toUpperCase()}
                      </Text>
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
          ) : null}
        </ScrollView>
        <VolunteerDetailsModal
          visible={!!selectedVolunteer}
          full_name={selectedVolunteer?.full_name ?? null}
          assignedCount={selectedVolunteer?.assignedCount ?? 0}
          services={selectedVolunteer?.services ?? []}
          onClose={closeVolunteerDetails}
        />
        <Modal
          animationType="slide"
          transparent
          visible={inviteModalVisible}
          onRequestClose={closeInviteModal}
        >
          <TouchableWithoutFeedback onPress={closeInviteModal}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={styles.modalContainer}>
                  <View style={styles.modalHandle} />
                  <Text style={styles.modalTitle}>Invite Volunteer</Text>

                  <TextInput
                    value={inviteFullName}
                    onChangeText={setInviteFullName}
                    placeholder="Full name"
                    style={styles.profileInput}
                    autoCapitalize="words"
                    autoComplete="name"
                    textContentType="name"
                    placeholderTextColor="#6B7280"
                    returnKeyType="next"
                  />

                  <TextInput
                    value={inviteEmail}
                    onChangeText={setInviteEmail}
                    placeholder="Email"
                    style={styles.profileInput}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                    textContentType="emailAddress"
                    keyboardType="email-address"
                    placeholderTextColor="#6B7280"
                    returnKeyType="send"
                    onSubmitEditing={submitInvite}
                  />

                  <Pressable
                    style={[
                      styles.saveButton,
                      !canInviteVolunteer && styles.disabledButton,
                    ]}
                    disabled={!canInviteVolunteer}
                    onPress={submitInvite}
                  >
                    <Text style={styles.saveButtonText}>
                      {isInvitingVolunteer ? "Inviting..." : "Send Invite"}
                    </Text>
                  </Pressable>

                  <Pressable
                    style={styles.cancelButton}
                    disabled={isInvitingVolunteer}
                    onPress={closeInviteModal}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </Pressable>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
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

  assignmentsCard: {
    backgroundColor: "#111111",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(212,190,143,0.4)",
    padding: 18,
    marginBottom: 18,
  },

  profileCard: {
    backgroundColor: "#111111",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(212,190,143,0.4)",
    padding: 18,
    marginBottom: 18,
  },

  preferencesCard: {
    backgroundColor: "#111111",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(212,190,143,0.4)",
    padding: 18,
    marginBottom: 18,
  },

  profileInput: {
    height: 52,
    backgroundColor: "#FFF",
    borderRadius: 14,
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 14,
    fontSize: 16,
  },

  saveButton: {
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: defaultStyles.primary,
  },

  disabledButton: {
    opacity: 0.45,
  },

  saveButtonText: {
    color: defaultStyles.secondary,
    fontSize: 16,
    fontWeight: "800",
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

  inviteButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: defaultStyles.primary,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  inviteButtonText: {
    color: defaultStyles.secondary,
    fontSize: 13,
    fontWeight: "800",
  },

  preferenceRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },

  rankBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(212,190,143,0.12)",
    borderWidth: 1,
    borderColor: "rgba(212,190,143,0.4)",
    marginRight: 12,
  },

  rankText: {
    color: defaultStyles.primary,
    fontSize: 15,
    fontWeight: "800",
  },

  preferenceStation: {
    flex: 1,
    color: "#E5E7EB",
    fontSize: 16,
    fontWeight: "800",
  },

  rankActions: {
    flexDirection: "row",
    gap: 8,
  },

  rankButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(212,190,143,0.08)",
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

  emptyText: {
    color: "#9CA3AF",
    fontSize: 15,
    fontWeight: "700",
    paddingTop: 16,
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
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 6,
  },

  cancelButton: {
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    backgroundColor: "rgba(212,190,143,0.12)",
    borderWidth: 1,
    borderColor: "rgba(212,190,143,0.35)",
  },

  cancelButtonText: {
    color: defaultStyles.primary,
    fontSize: 16,
    fontWeight: "800",
  },
});
