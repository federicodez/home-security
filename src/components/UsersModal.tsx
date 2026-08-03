import { Ionicons } from "@expo/vector-icons";
import {
  Modal,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { useMemo } from "react";
import { useProfile, useVolunteers } from "@/api/profiles";
import { defaultStyles } from "@/constants/Styles";
import {
  AVAILABILITY_FIELDS,
  type AssignmentWithRelations,
  type AvailabilityField,
  type VolunteerWithAssignments,
} from "@/types";

interface UsersModalProps {
  serviceId: string;
  modalVisible: boolean;
  onModalVisible: (value: boolean) => void;
  onAssign: (user: string, station: string) => void;
  onClear: (station: string) => void;
  assignments?: AssignmentWithRelations[];
  selectedStation?: string;
  serviceAvailabilityColumn?: AvailabilityField | string;
}

const availabilityFields = new Set<string>(Object.values(AVAILABILITY_FIELDS));

function isAvailabilityField(value?: string): value is AvailabilityField {
  return !!value && availabilityFields.has(value);
}

const UsersModal = ({
  serviceId,
  modalVisible,
  onModalVisible,
  onAssign,
  onClear,
  assignments,
  selectedStation,
  serviceAvailabilityColumn,
}: UsersModalProps) => {
  const { data: user } = useProfile();
  const { data } = useVolunteers(serviceId);
  const canManageRoster = user?.role === "admin";
  const availabilityField = isAvailabilityField(serviceAvailabilityColumn)
    ? serviceAvailabilityColumn
    : undefined;
  const hasAvailabilityData =
    !!availabilityField &&
    (data ?? []).some(
      (volunteer) => typeof volunteer[availabilityField] === "boolean",
    );
  const volunteers = useMemo(() => {
    const roster = [...(data ?? [])];

    if (
      canManageRoster &&
      user?.id &&
      !!user.full_name?.trim() &&
      user.can_serve !== false &&
      !roster.some((volunteer) => volunteer.id === user.id)
    ) {
      roster.push({
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        avatar_url: user.avatar_url,
        role: user.role,
        can_serve: user.can_serve,
        available_8am: user.available_8am,
        available_930am: user.available_930am,
        available_11am: user.available_11am,
        assignments: [],
        position_preferences: [],
      } as VolunteerWithAssignments);
    }

    const assignableVolunteers = canManageRoster
      ? roster
      : (data ?? []).filter((volunteer) => volunteer.id === user?.id);
    const preferenceRank = (volunteer: NonNullable<typeof data>[number]) =>
      volunteer.position_preferences?.find(
        (preference) => preference.station === selectedStation,
      )?.rank ?? Number.MAX_SAFE_INTEGER;

    return assignableVolunteers.sort((a, b) => {
      if (hasAvailabilityData && availabilityField) {
        const availabilityDelta =
          Number(b[availabilityField] === true) -
          Number(a[availabilityField] === true);

        if (availabilityDelta !== 0) return availabilityDelta;
      }

      const rankDelta = preferenceRank(a) - preferenceRank(b);

      if (rankDelta !== 0) return rankDelta;

      return (a.full_name ?? "").localeCompare(b.full_name ?? "");
    });
  }, [
    availabilityField,
    canManageRoster,
    data,
    hasAvailabilityData,
    selectedStation,
    user?.available_11am,
    user?.available_8am,
    user?.available_930am,
    user?.avatar_url,
    user?.can_serve,
    user?.email,
    user?.full_name,
    user?.id,
    user?.role,
  ]);
  const availableCount = hasAvailabilityData && availabilityField
    ? volunteers.filter((volunteer) => volunteer[availabilityField] === true)
        .length
    : volunteers.length;
  const volunteerCountLabel = `${volunteers.length} volunteer${
    volunteers.length === 1 ? "" : "s"
  }`;
  const selectedAssignment = assignments?.find(
    (assignment) =>
      assignment.service_id === serviceId &&
      assignment.station === selectedStation &&
      assignment.user_id,
  );
  const canClearSelectedAssignment =
    !!selectedAssignment &&
    (canManageRoster || selectedAssignment.user_id === user?.id);
  const canAssignToSelectedStation =
    canManageRoster ||
    !selectedAssignment ||
    selectedAssignment.user_id === user?.id;
  const selectedStationLabel = selectedStation
    ? `Station ${selectedStation}`
    : "selected station";

  const clearSelectedStation = () => {
    if (!selectedStation) return;

    onClear(selectedStation);
    onModalVisible(false);
  };

  const assignSelectedStation = (profileId: string) => {
    if (!selectedStation) return;

    onAssign(profileId, selectedStation);
  };

  const assignCurrentUserToSelectedStation = () => {
    if (!user?.id || !selectedStation) return;

    onAssign(user.id, selectedStation);
  };

  if (!modalVisible) {
    return null;
  }

  if (!canManageRoster) {
    return (
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => onModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => onModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContainer}>
                <View style={styles.handle} />

                <View style={styles.header}>
                  <Text style={styles.title}>
                    {canAssignToSelectedStation
                      ? "Take Position?"
                      : "Position Unavailable"}
                  </Text>
                  <Text style={styles.subtitle}>{selectedStationLabel}</Text>
                </View>

                {selectedAssignment && !canAssignToSelectedStation ? (
                  <Text style={styles.confirmationText}>
                    {selectedStationLabel} is already assigned.
                  </Text>
                ) : selectedAssignment ? (
                  <>
                    <Text style={styles.confirmationText}>
                      You are assigned to {selectedStationLabel}.
                    </Text>
                    <TouchableOpacity
                      style={styles.clearButton}
                      onPress={clearSelectedStation}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color={defaultStyles.secondary}
                      />
                      <View style={styles.clearButtonTextWrap}>
                        <Text style={styles.clearButtonText}>
                          Remove Me From {selectedStationLabel}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Text style={styles.confirmationText}>
                      Do you want to take {selectedStationLabel} for this
                      service?
                    </Text>
                    <TouchableOpacity
                      style={styles.confirmButton}
                      onPress={assignCurrentUserToSelectedStation}
                    >
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={20}
                        color={defaultStyles.secondary}
                      />
                      <Text style={styles.confirmButtonText}>
                        Take {selectedStationLabel}
                      </Text>
                    </TouchableOpacity>
                  </>
                )}

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => onModalVisible(false)}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  return (
    <Modal
      animationType="slide"
      transparent
      visible={modalVisible}
      onRequestClose={() => onModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => onModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalContainer}>
              <View style={styles.handle} />

              <View style={styles.header}>
                <Text style={styles.title}>Assign Volunteer</Text>
                <Text style={styles.subtitle}>
                  {hasAvailabilityData
                    ? `${availableCount} available / ${volunteers.length} total`
                    : volunteerCountLabel}
                </Text>
              </View>

              {canClearSelectedAssignment ? (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={clearSelectedStation}
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color={defaultStyles.secondary}
                  />
                  <View style={styles.clearButtonTextWrap}>
                    <Text style={styles.clearButtonText}>
                      Clear Station {selectedStation}
                    </Text>
                    <Text style={styles.clearButtonHint}>
                      {selectedAssignment.profile?.full_name ??
                        "Assigned volunteer"}
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : null}

              {selectedAssignment && !canAssignToSelectedStation ? (
                <Text style={styles.lockedStationText}>
                  Station {selectedStation} is already assigned.
                </Text>
              ) : null}

              <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
              >
                {canAssignToSelectedStation
                  ? volunteers.map(
                      ({
                        id,
                        full_name,
                        position_preferences,
                        available_8am,
                        available_930am,
                        available_11am,
                      }) => {
                        const currentAssignment = assignments?.find(
                          (assignment) =>
                            assignment.service_id === serviceId &&
                            assignment.user_id === id,
                        );
                        const preferenceRank = position_preferences?.find(
                          (preference) => preference.station === selectedStation,
                        )?.rank;
                        const isAvailableForService =
                          hasAvailabilityData && availabilityField
                            ? Boolean(
                                {
                                  available_8am,
                                  available_930am,
                                  available_11am,
                                }[availabilityField],
                              )
                            : true;
                        const isAssignedToSelectedStation =
                          currentAssignment?.station === selectedStation;
                        const canAssignVolunteer =
                          !isAssignedToSelectedStation &&
                          isAvailableForService;

                        return (
                          <TouchableOpacity
                            key={id}
                            style={[
                              styles.option,
                              !canAssignVolunteer && styles.disabledOption,
                            ]}
                            disabled={!canAssignVolunteer}
                            onPress={() => assignSelectedStation(id)}
                          >
                            <View style={styles.userIcon}>
                              <Ionicons
                                name="person-outline"
                                size={20}
                                color={defaultStyles.primary}
                              />
                            </View>

                            <View style={styles.userInfo}>
                              <Text style={styles.optionText}>
                                {full_name?.toUpperCase()}
                              </Text>

                              <Text
                                style={[
                                  styles.assignmentHint,
                                  currentAssignment
                                    ? styles.assignedHint
                                    : preferenceRank
                                      ? styles.preferenceHint
                                      : isAvailableForService
                                        ? styles.availableHint
                                        : styles.unavailableHint,
                                ]}
                              >
                                {isAssignedToSelectedStation
                                  ? "Already assigned here"
                                  : currentAssignment
                                  ? `Currently: Station ${currentAssignment.station}`
                                  : preferenceRank
                                    ? `Preference #${preferenceRank} for ${selectedStation}`
                                    : isAvailableForService
                                      ? "Available for this service"
                                      : "Not marked available for this service"}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        );
                      },
                    )
                  : null}
              </ScrollView>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => onModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  userInfo: {
    flex: 1,
  },

  assignmentHint: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: "600",
  },

  assignedHint: {
    color: defaultStyles.primary,
  },

  preferenceHint: {
    color: "#E5E7EB",
  },

  availableHint: {
    color: "#6B7280",
  },

  unavailableHint: {
    color: "#9CA3AF",
  },

  lockedStationText: {
    color: "#9CA3AF",
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 21,
    marginBottom: 14,
  },

  confirmationText: {
    color: "#E5E7EB",
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 23,
    marginBottom: 16,
  },

  confirmButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: defaultStyles.primary,
    borderRadius: 14,
    minHeight: 52,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  confirmButtonText: {
    color: defaultStyles.secondary,
    fontSize: 16,
    fontWeight: "800",
  },

  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: defaultStyles.primary,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
  },

  clearButtonTextWrap: {
    flex: 1,
  },

  clearButtonText: {
    color: defaultStyles.secondary,
    fontSize: 16,
    fontWeight: "800",
  },

  clearButtonHint: {
    color: "rgba(0,0,0,0.7)",
    fontSize: 13,
    marginTop: 2,
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
    maxHeight: "70%",
  },

  handle: {
    width: 42,
    height: 5,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignSelf: "center",
    marginBottom: 18,
  },

  header: {
    marginBottom: 14,
  },

  title: {
    color: defaultStyles.primary,
    fontSize: 28,
    fontWeight: "800",
  },

  subtitle: {
    color: "#9CA3AF",
    fontSize: 15,
    marginTop: 4,
  },

  scrollView: {
    maxHeight: 320,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },

  disabledOption: {
    opacity: 0.45,
  },

  userIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(212,190,143,0.1)",
  },

  optionText: {
    flex: 1,
    color: "#E5E7EB",
    fontSize: 16,
    fontWeight: "800",
  },

  cancelButton: {
    marginTop: 18,
    height: 52,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(212,190,143,0.12)",
    borderWidth: 1,
    borderColor: "rgba(212,190,143,0.35)",
  },

  cancelText: {
    color: defaultStyles.primary,
    fontSize: 17,
    fontWeight: "800",
  },
});

export default UsersModal;
