import {
  Modal,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { getTeamMembers } from "@/api/team_members";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

interface UsersModalProps {
  modalVisible: boolean;
  onModalVisible: (value: boolean) => void;
  onHandleAssign: (user: string) => void;
}

const UsersModal = ({
  modalVisible,
  onModalVisible,
  onHandleAssign,
}: UsersModalProps) => {
  const { data } = getTeamMembers();
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
                  <ScrollView style={styles.scrollView}>
                    {data?.map(({ id, name }, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.option}
                        onPress={() => onHandleAssign(id)}
                      >
                        <Text style={styles.optionText}>
                          {name.toUpperCase()}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

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

export default UsersModal;
