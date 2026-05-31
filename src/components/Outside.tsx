import { ImageBackground } from "react-native";
import Svg, { Line, Path, Rect, Text } from "react-native-svg";
import UsersModal from "./UsersModal";
import Station from "./Station";
import type { AssignmentWithRelations } from "@/types";

type OutsideProps = {
  serviceId: string;
  modalVisible: boolean;
  onModalVisible: (modal: boolean) => void;
  onAssign: (profileId: string) => void;
  onClear: () => void;
  onPosition: (position: string) => void;
  assignments?: AssignmentWithRelations[];
};

export default function Outside({
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
      <ImageBackground
        source={require("assets/images/home_church.png")}
        resizeMode="repeat"
        style={{ flex: 1 }}
      >
        <Svg width="100%" height="100%" viewBox="0 0 390 760">
          <Rect fill="black" x="32" y="105" width="326" height="470" />

          {/* Top street */}
          <Text
            x="195"
            y="38"
            fill="white"
            fontSize="22"
            fontWeight="bold"
            textAnchor="middle"
          >
            200 Pasadena Ave.
          </Text>
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
          <Text
            x="195"
            y="645"
            fill="white"
            fontSize="22"
            fontWeight="bold"
            textAnchor="middle"
          >
            216 Giuffria Ave.
          </Text>

          {/* Outer overhang/property boundary */}
          <Rect
            x="32"
            y="105"
            width="326"
            height="470"
            stroke="yellow"
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
          <Text
            x="193"
            y="130"
            fill="cyan"
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
          >
            POA
          </Text>

          {/* Home Church */}
          <Rect
            x="70"
            y="165"
            width="82"
            height="350"
            stroke="lime"
            strokeWidth={2}
            fill="none"
          />
          <Text
            x="111"
            y="335"
            fill="white"
            fontSize="15"
            fontWeight="bold"
            textAnchor="middle"
          >
            Home
          </Text>
          <Text
            x="111"
            y="357"
            fill="white"
            fontSize="15"
            fontWeight="bold"
            textAnchor="middle"
          >
            Church
          </Text>

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
            stroke="lime"
            strokeWidth={2}
            fill="none"
          />
          <Text
            x="247"
            y="220"
            fill="white"
            fontSize="13"
            fontWeight="bold"
            textAnchor="middle"
          >
            School
          </Text>

          {/* Open Field */}
          <Text
            x="330"
            y="208"
            fill="white"
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
          >
            Open
          </Text>
          <Text
            x="330"
            y="228"
            fill="white"
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
          >
            Field
          </Text>

          {/* Empty Concrete Area */}
          <Text
            x="280"
            y="345"
            fill="white"
            fontSize="15"
            fontWeight="bold"
            textAnchor="middle"
          >
            Empty
          </Text>
          <Text
            x="280"
            y="367"
            fill="white"
            fontSize="15"
            fontWeight="bold"
            textAnchor="middle"
          >
            Concrete
          </Text>
          <Text
            x="280"
            y="389"
            fill="white"
            fontSize="15"
            fontWeight="bold"
            textAnchor="middle"
          >
            Area
          </Text>

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
            stroke="lime"
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
      </ImageBackground>
    )
  );
}
