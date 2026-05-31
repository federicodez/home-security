import Svg, { Circle, G, Line, Path, Rect, Text } from "react-native-svg";
import { ImageBackground } from "react-native";
import UsersModal from "./UsersModal";
import Station from "./Station";
import type { AssignmentWithRelations } from "@/types";

type KidsFloorProps = {
  serviceId: string;
  modalVisible: boolean;
  onModalVisible: (modal: boolean) => void;
  onAssign: (profileId: string) => void;
  onClear: () => void;
  onPosition: (position: string) => void;
  assignments?: AssignmentWithRelations[];
};

export default function KidsFloorPlan({
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
      <ImageBackground
        source={require("assets/images/home_church.png")}
        resizeMode="repeat"
        style={{ flex: 1 }}
      >
        <Svg width="100%" height="100%" viewBox="0 0 390 760">
          <Rect x="35" y="80" width="320" height="610" fill="black" />

          {/* title */}
          <Text
            x="195"
            y="42"
            fill="white"
            fontSize="24"
            fontWeight="bold"
            textAnchor="middle"
          >
            Kids Area
          </Text>

          {/* outer building */}
          <Rect
            x="35"
            y="80"
            width="320"
            height="610"
            stroke="lime"
            strokeWidth={2}
            fill="none"
          />

          {/* hallway */}
          <Rect
            x="150"
            y="80"
            width="90"
            height="610"
            stroke="cyan"
            strokeWidth={2}
            fill="none"
          />

          <Text
            x="195"
            y="385"
            fill="cyan"
            fontSize="16"
            fontWeight="bold"
            textAnchor="middle"
          >
            Hallway
          </Text>

          {/* left big room */}
          <Rect
            x="35"
            y="80"
            width="115"
            height="610"
            stroke="white"
            strokeWidth={2}
            fill="none"
          />

          <Text
            x="92"
            y="360"
            fill="white"
            fontSize="16"
            fontWeight="bold"
            textAnchor="middle"
          >
            Big
          </Text>
          <Text
            x="92"
            y="382"
            fill="white"
            fontSize="16"
            fontWeight="bold"
            textAnchor="middle"
          >
            Room
          </Text>

          {/* Room 1 */}
          <Rect
            x={240}
            y={80}
            width={115}
            height={270}
            stroke="white"
            strokeWidth={2}
            fill="none"
          />

          {/* Room 2 */}
          <Rect
            x={240}
            y={480}
            width={115}
            height={210}
            stroke="white"
            strokeWidth={2}
            fill="none"
          />

          <Text
            x="298"
            y="220"
            fill="white"
            fontSize="16"
            fontWeight="bold"
            textAnchor="middle"
          >
            Room 1
          </Text>

          <Text
            x="298"
            y="540"
            fill="white"
            fontSize="16"
            fontWeight="bold"
            textAnchor="middle"
          >
            Room 2
          </Text>

          {/* Bathroom */}
          <Rect
            x={240}
            y={350}
            width={115}
            height={130}
            stroke="white"
            strokeWidth={2}
            fill="none"
          />

          <Text
            x={298}
            y={395}
            fill="white"
            fontSize={16}
            fontWeight="bold"
            textAnchor="middle"
          >
            Bathroom
          </Text>

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
          <Line x1={330} y1={430} x2={330} y2={440} stroke="white" />

          {/* hallway edges */}
          <Line
            x1="150"
            y1="80"
            x2="150"
            y2="690"
            stroke="cyan"
            strokeWidth={2}
          />
          <Line
            x1="240"
            y1="80"
            x2="240"
            y2="690"
            stroke="cyan"
            strokeWidth={2}
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

          {/* doors */}

          {/* big room doors */}
          <Door x={150} y={565} direction="left" />
          <Door x={150} y={265} direction="left" />
          {/* room 1 door*/}
          <Door x={240} y={250} direction="right" />
          {/* bathroom  door*/}
          <Door x={240} y={410} direction="right" />
          {/* room 2 door*/}
          <Door x={240} y={560} direction="right" />
        </Svg>
      </ImageBackground>
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
        stroke="white"
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
          stroke="white"
        />
      ))}

      {/* direction arrow */}
      <Path d={arrow} fill="white" />

      <Text
        x={x + width / 2}
        y={y + height + 16}
        fill="white"
        fontSize="11"
        fontWeight="bold"
        textAnchor="middle"
      >
        {label}
      </Text>
    </G>
  );
}

function Door({
  x,
  y,
  size = 28,
  direction,
}: {
  x: number;
  y: number;
  size?: number;
  direction: "left" | "right" | "up" | "down";
}) {
  let wallLine = null;
  let arcPath = "";

  switch (direction) {
    case "right":
      wallLine = (
        <Line
          x1={x}
          y1={y}
          x2={x}
          y2={y + size}
          stroke="white"
          strokeWidth={2}
        />
      );
      arcPath = `M ${x} ${y} A ${size} ${size} 0 0 1 ${x + size} ${y + size}`;
      break;

    case "left":
      wallLine = (
        <Line
          x1={x}
          y1={y}
          x2={x}
          y2={y + size}
          stroke="white"
          strokeWidth={2}
        />
      );
      arcPath = `M ${x} ${y + size} A ${size} ${size} 0 0 1 ${x - size} ${y}`;
      break;

    case "down":
      wallLine = (
        <Line
          x1={x}
          y1={y}
          x2={x + size}
          y2={y}
          stroke="white"
          strokeWidth={2}
        />
      );
      arcPath = `M ${x} ${y} A ${size} ${size} 0 0 1 ${x + size} ${y + size}`;
      break;

    case "up":
      wallLine = (
        <Line
          x1={x}
          y1={y}
          x2={x + size}
          y2={y}
          stroke="white"
          strokeWidth={2}
        />
      );
      arcPath = `M ${x + size} ${y} A ${size} ${size} 0 0 1 ${x} ${y - size}`;
      break;
  }

  return (
    <G>
      {wallLine}
      <Path d={arcPath} stroke="white" strokeWidth={2} fill="none" />
    </G>
  );
}
