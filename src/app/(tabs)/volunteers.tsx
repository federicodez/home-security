import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ImageBackground,
} from "react-native";
import {
  useVolunteerAssignments,
  useProfile,
  useUpdateVolunteering,
} from "@/api/profiles";
import Button from "@/components/Button";
import VolunteerModal from "@/components/VolunteerModal";

export default function Tab() {
  const [volunteerModalVisible, setVolunteerModalVisible] = useState(false);
  const { data: user } = useProfile();
  const { data: volunteers } = useVolunteerAssignments();
  const { mutate: updateVolunteer } = useUpdateVolunteering();

  const handleVolunteerStatusChange = (status: boolean) => {
    try {
      updateVolunteer(status);
    } catch {
      throw new Error("volunteer update failed");
    } finally {
      setVolunteerModalVisible(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <ImageBackground
        source={require("assets/images/home_church.png")}
        resizeMode="repeat"
        style={{ flex: 1 }}
      >
        <View style={styles.modalContainer}>
          <VolunteerModal
            modalVisible={volunteerModalVisible}
            onModalVisible={setVolunteerModalVisible}
            onHandleChange={handleVolunteerStatusChange}
          />
          <ScrollView style={styles.scrollView}>
            {volunteers?.map(({ user_id, full_name, services }) => (
              <View key={user_id}>
                <Text style={styles.optionText}>
                  {full_name?.toUpperCase()}
                </Text>
                {services.map(({ station, service_name }) => (
                  <View key={service_name} style={{ paddingEnd: 20 }}>
                    <Text>
                      {service_name} - {station ?? "Unassigned"}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>
        </View>
      </ImageBackground>
      <Button
        text={user?.volunteering ? "Volunteering ✅" : "Not volunteering ❌"}
        onPress={() => setVolunteerModalVisible(true)}
      />
    </View>
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
    margin: "auto",
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
