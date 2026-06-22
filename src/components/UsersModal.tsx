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
import { useVolunteers } from "@/api/profiles";
import { defaultStyles } from "@/constants/Styles";
import type { AssignmentWithRelations } from "@/types";

interface UsersModalProps {
  serviceId: string;
  modalVisible: boolean;
  onModalVisible: (value: boolean) => void;
  onAssign: (user: string) => void;
  assignments?: AssignmentWithRelations[];
}

const UsersModal = ({
  serviceId,
  modalVisible,
  onModalVisible,
  onAssign,
  assignments,
}: UsersModalProps) => {
  const { data } = useVolunteers(serviceId);

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
                  {data?.length ?? 0} available
                </Text>
              </View>

              <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
              >
                {data?.map(({ id, full_name }) => {
                  const currentAssignment = assignments?.find(
                    (assignment) =>
                      assignment.service_id === serviceId &&
                      assignment.user_id === id,
                  );

                  return (
                    <TouchableOpacity
                      key={id}
                      style={styles.option}
                      onPress={() => onAssign(id)}
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
                              : styles.availableHint,
                          ]}
                        >
                          {currentAssignment
                            ? `Currently: Station ${currentAssignment.station}`
                            : "Available for this service"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
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

  availableHint: {
    color: "#6B7280",
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
