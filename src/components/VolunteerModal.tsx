import { StatusBar } from "expo-status-bar";
import {
  Alert,
  Platform,
  Modal,
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import Button from "@/components/Button";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useAuth } from "@/providers/AuthProvider";

interface VolunteerModalProps {
  modalVisible: boolean;
  onModalVisible: (value: boolean) => void;
  onHandleChange: (status: boolean) => void;
}

export default function VolunteerModal({
  modalVisible,
  onModalVisible,
  onHandleChange,
}: VolunteerModalProps) {
  const { signOut } = useAuth();
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent
          visible={modalVisible}
          onRequestClose={() => {
            onModalVisible(!modalVisible);
          }}
        >
          <TouchableWithoutFeedback onPress={() => onModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={styles.modalContainer}>
                  <Text style={styles.textStyle}>Volunteering?</Text>
                  <Button text="Yes 👍" onPress={() => onHandleChange(true)} />
                  <Button
                    text="No 👎"
                    onPress={async () => {
                      try {
                        onHandleChange(false);
                        await signOut();
                        Alert.alert("Signed out");
                      } catch {
                        Alert.alert("Logout failed");
                      }
                    }}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>

          <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  option: {
    padding: 10,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 18,
  },
  scrollView: {
    marginBottom: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 90,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 50,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textStyle: {
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    borderBottomColor: "black",
    borderBottomWidth: 2,
  },
});
