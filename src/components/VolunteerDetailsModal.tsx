import {
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Text,
  StyleSheet,
} from "react-native";
import { defaultStyles } from "@/constants/Styles";

interface Service {
  service_name: string | null;
  station: string | null;
}

interface VolunteerDetailsModalProps {
  visible: boolean;
  full_name: string | null;
  assignedCount: number;
  services: Service[];
  onClose: () => void;
}

const VolunteerDetailsModal = ({
  visible,
  full_name,
  assignedCount,
  services,
  onClose,
}: VolunteerDetailsModalProps) => {
  if (!visible) {
    return null;
  }

  return (
    <Modal transparent animationType="slide" visible={visible}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet}>
              <View style={styles.handle} />

              <Text style={styles.name}>{full_name}</Text>
              <Text style={styles.summary}>
                {assignedCount} / 3 Services Assigned
              </Text>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Assignments</Text>

                {services.map((service) => (
                  <View key={service.service_name} style={styles.row}>
                    <Text style={styles.label}>{service.service_name}</Text>
                    <Text
                      style={[
                        styles.value,
                        service.station ? styles.assigned : styles.unassigned,
                      ]}
                    >
                      {service.station
                        ? `Station ${service.station}`
                        : "Unassigned"}
                    </Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.72)",
  },
  sheet: {
    backgroundColor: "#0A0A0A",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(212,190,143,0.45)",
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 34,
  },
  handle: {
    width: 42,
    height: 5,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignSelf: "center",
    marginBottom: 18,
  },
  name: {
    color: defaultStyles.primary,
    fontSize: 26,
    fontWeight: "800",
  },
  summary: {
    color: "#9CA3AF",
    fontSize: 16,
    marginTop: 4,
    marginBottom: 20,
  },
  section: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
    paddingTop: 16,
  },
  sectionTitle: {
    color: "#A0A3B1",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  label: {
    color: "#E5E7EB",
    fontSize: 17,
    fontWeight: "700",
  },
  value: {
    fontSize: 17,
    fontWeight: "800",
  },
  assigned: {
    color: defaultStyles.primary,
  },
  unassigned: {
    color: "#6B7280",
  },
  closeButton: {
    marginTop: 20,
    height: 52,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(212,190,143,0.12)",
    borderWidth: 1,
    borderColor: "rgba(212,190,143,0.35)",
  },
  closeText: {
    color: defaultStyles.primary,
    fontSize: 17,
    fontWeight: "800",
  },
});

export default VolunteerDetailsModal;
