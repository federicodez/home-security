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
import { useVolunteers } from "@/api/profiles";
import { defaultStyles } from "@/constants/Styles";
import {
  AVAILABILITY_FIELDS,
  type AssignmentWithRelations,
  type AvailabilityField,
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
  const { data } = useVolunteers(serviceId);
  const availabilityField = isAvailabilityField(serviceAvailabilityColumn)
    ? serviceAvailabilityColumn
    : undefined;
  const hasAvailabilityData =
    !!availabilityField &&
    (data ?? []).some(
      (volunteer) => typeof volunteer[availabilityField] === "boolean",
    );
  const volunteers = useMemo(() => {
    const preferenceRank = (volunteer: NonNullable<typeof data>[number]) =>
      volunteer.position_preferences?.find(
        (preference) => preference.station === selectedStation,
      )?.rank ?? Number.MAX_SAFE_INTEGER;

    return [...(data ?? [])].sort((a, b) => {
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
  }, [availabilityField, data, hasAvailabilityData, selectedStation]);
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

  const clearSelectedStation = () => {
    if (!selectedStation) return;

    onClear(selectedStation);
    onModalVisible(false);
  };

  const assignSelectedStation = (profileId: string) => {
    if (!selectedStation) return;

    onAssign(profileId, selectedStation);
  };

  if (!modalVisible) {
    return null;
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

              {selectedAssignment ? (
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

              <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
              >
                {volunteers.map(
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
                  const isAvailableForService = hasAvailabilityData && availabilityField
                    ? Boolean(
                        { available_8am, available_930am, available_11am }[
                          availabilityField
                        ],
                      )
                    : true;

                  return (
                    <TouchableOpacity
                      key={id}
                      style={styles.option}
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
                          {currentAssignment
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
                )}
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
