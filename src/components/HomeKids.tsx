import Svg, {
  Circle,
  G,
  Line,
  Path,
  Rect,
  Text as SVGText,
} from "react-native-svg";
import { StyleSheet, View, Text } from "react-native";
import { defaultStyles } from "@/constants/Styles";
import Station from "./Station";
import Door from "./Door";
import type { AssignmentWithRelations } from "@/types";

type KidsFloorProps = {
  serviceTime: string;
  serviceId: string;
  modalVisible: boolean;
  onModalVisible: (modal: boolean) => void;
  onAssign: (profileId: string) => void;
  onClear: () => void;
  onPosition: (position: string) => void;
  assignments?: AssignmentWithRelations[];
};

export default function KidsFloorPlan({
  serviceTime,
  serviceId,
  modalVisible,
  onModalVisible,
  onAssign,
  onClear,
  onPosition,
  assignments,
}: KidsFloorProps) {
  const assignment = assignments?.find(
    ({ station, service: { id } }) => id === serviceId && station === "K",
  );
  return (
    assignment && (
      <View style={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.title}>Home Kids</Text>
          <Text style={styles.subtitle}>{serviceTime} Service</Text>
        </View>
        <Svg width="100%" height="100%" viewBox="35 75 320 620">
          {/* hallway */}
          <Rect
            x="150"
            y="80"
            width="100"
            height="610"
            stroke={defaultStyles.primary}
            strokeWidth={2}
            fill="none"
          />

          <SVGText
            x="195"
            y="385"
            fill={defaultStyles.primary}
            fontSize="16"
            fontWeight="bold"
            textAnchor="middle"
          >
            Hallway
          </SVGText>

          {/* left big room */}
          <Rect
            x="35"
            y="80"
            width="115"
            height="610"
            stroke={defaultStyles.primary}
            strokeWidth={2}
            fill="none"
          />

          <SVGText
            x="92"
            y="360"
            fill={defaultStyles.primary}
            fontSize="16"
            fontWeight="bold"
            textAnchor="middle"
          >
            Big
          </SVGText>
          <SVGText
            x="92"
            y="382"
            fill={defaultStyles.primary}
            fontSize="16"
            fontWeight="bold"
            textAnchor="middle"
          >
            Room
          </SVGText>

          {/* Room 1 */}
          <Rect
            x={250}
            y={80}
            width={120}
            height={270}
            stroke={defaultStyles.primary}
            strokeWidth={2}
            fill="none"
          />

          {/* Room 2 */}
          <Rect
            x={250}
            y={480}
            width={120}
            height={210}
            stroke={defaultStyles.primary}
            strokeWidth={2}
            fill="none"
          />

          <SVGText
            x="298"
            y="220"
            fill={defaultStyles.primary}
            fontSize="16"
            fontWeight="bold"
            textAnchor="middle"
          >
            Room 1
          </SVGText>

          <SVGText
            x="298"
            y="540"
            fill={defaultStyles.primary}
            fontSize="16"
            fontWeight="bold"
            textAnchor="middle"
          >
            Room 2
          </SVGText>

          {/* Bathroom */}
          <Rect
            x={250}
            y={350}
            width={120}
            height={130}
            stroke={defaultStyles.primary}
            strokeWidth={2}
            fill="none"
          />

          <SVGText
            x={298}
            y={395}
            fill={defaultStyles.primary}
            fontSize={16}
            fontWeight="bold"
            textAnchor="middle"
          >
            Bathroom
          </SVGText>

          {/* toilet */}
          <Rect
            x={268}
            y={425}
            width={22}
            height={26}
            rx={4}
            stroke="white"
            fill="none"
          />
          <Circle cx={279} cy={456} r={10} stroke="white" fill="none" />

          {/* divider */}
          <Line x1={300} y1={420} x2={300} y2={465} stroke="white" />

          {/* sink */}
          <Path
            d="M315 445 Q330 465 345 445"
            stroke="white"
            strokeWidth={2}
            fill="none"
          />
          <Circle cx={330} cy={440} r={3} fill="white" />
          <Line
            x1={330}
            y1={430}
            x2={330}
            y2={440}
            stroke={defaultStyles.primary}
          />

          {/* top stairs at hallway edge */}
          <Stairs
            x={45}
            y={95}
            width={95}
            height={55}
            direction="right"
            label="Top Stairs"
          />

          {/* bottom stairs at hallway edge */}
          {/* bottom stairs on left */}
          <Stairs
            x={45}
            y={610}
            width={95}
            height={55}
            direction="right"
            label="Bottom Stairs"
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

          {/* doors */}

          {/* big room doors */}
          <Door x={150} y={565} direction="left" />
          <Door x={150} y={265} direction="left" />
          {/* room 1 door*/}
          <Door x={250} y={250} direction="right" />
          {/* bathroom  door*/}
          <Door x={250} y={410} direction="right" />
          {/* room 2 door*/}
          <Door x={250} y={560} direction="right" />
        </Svg>
      </View>
    )
  );
}

function Stairs({
  x,
  y,
  width,
  height,
  direction,
  label,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  direction: "left" | "right";
  label: string;
}) {
  const arrow =
    direction === "right"
      ? `M ${x + width - 15} ${y + height / 2}
         L ${x + width - 35} ${y + height / 2 - 10}
         L ${x + width - 35} ${y + height / 2 + 10} Z`
      : `M ${x + 15} ${y + height / 2}
         L ${x + 35} ${y + height / 2 - 10}
         L ${x + 35} ${y + height / 2 + 10} Z`;

  return (
    <G>
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        stroke={defaultStyles.primary}
        fill="none"
      />

      {/* vertical stair treads */}
      {Array.from({ length: 7 }).map((_, i) => (
        <Line
          key={i}
          x1={x + 10 + i * 12}
          y1={y}
          x2={x + 10 + i * 12}
          y2={y + height}
          stroke={defaultStyles.primary}
        />
      ))}

      {/* direction arrow */}
      <Path d={arrow} fill={defaultStyles.primary} />

      <SVGText
        x={x + width / 2}
        y={y + height + 16}
        fill={defaultStyles.primary}
        fontSize="11"
        fontWeight="bold"
        textAnchor="middle"
      >
        {label}
      </SVGText>
    </G>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "black",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 105,
  },

  header: {
    backgroundColor: "rgba(17,17,17,0.96)",
    borderWidth: 1,
    borderColor: "rgba(212,190,143,0.55)",
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
  },

  title: {
    color: "#D4BE8F",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 1,
  },

  subtitle: {
    color: "#9CA3AF",
    fontSize: 16,
    marginTop: 4,
  },
});
