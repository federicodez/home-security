import { View, Text, Image, StyleSheet } from "react-native";
import Svg, { Line, Path, Rect, Text as SVGText } from "react-native-svg";
import UsersModal from "./UsersModal";
import Station from "./Station";
import type { AssignmentWithRelations } from "@/types";

type OutsideProps = {
  serviceTime: string;
  serviceId: string;
  modalVisible: boolean;
  onModalVisible: (modal: boolean) => void;
  onAssign: (profileId: string) => void;
  onClear: () => void;
  onPosition: (position: string) => void;
  assignments?: AssignmentWithRelations[];
};

export default function Outside({
  serviceTime,
  serviceId,
  modalVisible,
  onModalVisible,
  onAssign,
  onClear,
  onPosition,
  assignments,
}: OutsideProps) {
  const assignment = assignments?.find(
    ({ station, service: { id } }) => id === serviceId && station === "A",
  );
  return (
    assignment && (
      <View style={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.title}>Outside Grounds</Text>
          <Text style={styles.subtitle}>{serviceTime} Service</Text>
        </View>

        <View style={styles.mapCard}>
          <Svg
            width="100%"
            height="100%"
            viewBox="0 0 390 680"
            preserveAspectRatio="xMidYMid meet"
          >
            <Rect fill="black" x="32" y="105" width="326" height="470" />

            {/* Top street */}
            <SVGText
              x="195"
              y="38"
              fill="white"
              fontSize="18"
              fontWeight="bold"
              textAnchor="middle"
            >
              200 Pasadena Ave.
            </SVGText>
            <Line
              x1="12"
              y1="58"
              x2="378"
              y2="58"
              stroke="white"
              strokeWidth={1.5}
            />

            {/* Bottom street */}
            <Line
              x1="12"
              y1="610"
              x2="378"
              y2="610"
              stroke="white"
              strokeWidth={1.5}
            />
            <SVGText
              x="195"
              y="645"
              fill="white"
              fontSize="18"
              fontWeight="bold"
              textAnchor="middle"
            >
              216 Giuffria Ave.
            </SVGText>

            {/* Outer overhang/property boundary */}
            <Rect
              x="22"
              y="95"
              width="346"
              height="480"
              stroke="#D4BE8F"
              strokeWidth={2}
              fill="none"
            />

            {/* Top POA / A */}
            <Line
              x1="168"
              y1="105"
              x2="218"
              y2="105"
              stroke="cyan"
              strokeWidth={3}
            />
            <SVGText
              x="193"
              y="130"
              fill="cyan"
              fontSize="14"
              fontWeight="bold"
              textAnchor="middle"
            >
              POA
            </SVGText>

            {/* Home Church */}
            <Rect
              x="70"
              y="165"
              width="82"
              height="350"
              stroke="#22C55E"
              strokeWidth={2}
              fill="none"
            />
            <SVGText
              x="111"
              y="335"
              fill="white"
              fontSize="15"
              fontWeight="bold"
              textAnchor="middle"
            >
              Home
            </SVGText>
            <SVGText
              x="111"
              y="357"
              fill="white"
              fontSize="15"
              fontWeight="bold"
              textAnchor="middle"
            >
              Church
            </SVGText>

            {/* Bright School */}
            <Path
              d="
          M218 130
          H270
          V175
          H295
          V240
          H270
          V285
          H218
          V255
          H195
          V205
          H218
          Z
        "
              stroke="#22C55E"
              strokeWidth={2}
              fill="none"
            />
            <SVGText
              x="247"
              y="220"
              fill="white"
              fontSize="13"
              fontWeight="bold"
              textAnchor="middle"
            >
              School
            </SVGText>

            {/* Open Field */}
            <SVGText
              x="330"
              y="208"
              fill="white"
              fontSize="14"
              fontWeight="bold"
              textAnchor="middle"
            >
              Open
            </SVGText>
            <SVGText
              x="330"
              y="228"
              fill="white"
              fontSize="14"
              fontWeight="bold"
              textAnchor="middle"
            >
              Field
            </SVGText>

            {/* Empty Concrete Area */}
            <SVGText
              x="280"
              y="345"
              fill="white"
              fontSize="15"
              fontWeight="bold"
              textAnchor="middle"
            >
              Empty
            </SVGText>
            <SVGText
              x="280"
              y="367"
              fill="white"
              fontSize="15"
              fontWeight="bold"
              textAnchor="middle"
            >
              Concrete
            </SVGText>
            <SVGText
              x="280"
              y="389"
              fill="white"
              fontSize="15"
              fontWeight="bold"
              textAnchor="middle"
            >
              Area
            </SVGText>

            {/* User selection modal */}
            <UsersModal
              modalVisible={modalVisible}
              onModalVisible={onModalVisible}
              onAssign={onAssign}
            />

            <Station
              assignment={assignment}
              serviceId={serviceId}
              modalVisible={modalVisible}
              onAssign={onAssign}
              onClear={onClear}
              onPosition={onPosition}
              onModalVisible={onModalVisible}
            />
            {/* Fences */}
            <Line
              x1="152"
              y1="215"
              x2="195"
              y2="215"
              stroke="red"
              strokeWidth={2}
              strokeDasharray="7 5"
            />
            <Line
              x1="152"
              y1="260"
              x2="190"
              y2="260"
              stroke="red"
              strokeWidth={2}
              strokeDasharray="7 5"
            />
            <Line
              x1="190"
              y1="260"
              x2="190"
              y2="410"
              stroke="red"
              strokeWidth={2}
              strokeDasharray="7 5"
            />
            <Line
              x1="152"
              y1="410"
              x2="190"
              y2="410"
              stroke="red"
              strokeWidth={2}
              strokeDasharray="7 5"
            />
            <Line
              x1="152"
              y1="455"
              x2="205"
              y2="455"
              stroke="red"
              strokeWidth={2}
              strokeDasharray="7 5"
            />
            <Line
              x1="205"
              y1="255"
              x2="205"
              y2="470"
              stroke="red"
              strokeWidth={2}
              strokeDasharray="7 5"
            />

            {/* Bottom building: Extra Space + Sea Food Guy */}
            <Path
              d="
          M190 480
          H315
          V505
          H335
          V555
          H315
          V575
          H205
          V555
          H175
          V505
          H190
          Z
        "
              stroke="#22C55E"
              strokeWidth={2}
              fill="none"
            />

            {/* Right POA / B */}
            <Line
              x1="358"
              y1="350"
              x2="358"
              y2="405"
              stroke="cyan"
              strokeWidth={3}
            />

            {/* Bottom POA / C */}
            <Line
              x1="180"
              y1="575"
              x2="230"
              y2="575"
              stroke="cyan"
              strokeWidth={3}
            />
          </Svg>
        </View>
      </View>
    )
  );
}

const GOLD = "#D4BE8F";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 105,
  },

  header: {
    backgroundColor: "rgba(17,17,17,0.96)",
    borderWidth: 1,
    borderColor: "rgba(212,190,143,0.55)",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },

  title: {
    color: GOLD,
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: 1,
  },

  subtitle: {
    color: "#9CA3AF",
    fontSize: 15,
    marginTop: 4,
  },

  mapCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(212,190,143,0.45)",
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "#050505",
  },
  headerLogo: {
    position: "absolute",
    right: 20,
    top: 20,
    width: 80,
    height: 80,
    opacity: 0.08,
  },
});
