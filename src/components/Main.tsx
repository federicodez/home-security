import { View, Text, Image, StyleSheet } from "react-native";
import Svg, { Rect } from "react-native-svg";
import PositionList from "./PositionList";
import type { AssignmentWithRelations } from "@/types";

interface MainProps {
  serviceTime: string;
  serviceId: string;
  modalVisible: boolean;
  onModalVisible: (modal: boolean) => void;
  onAssign: (profileId: string) => void;
  onClear: () => void;
  onPosition: (position: string) => void;
  assignments?: AssignmentWithRelations[];
}

export default function Main({
  serviceTime,
  serviceId,
  modalVisible,
  onModalVisible,
  onAssign,
  onClear,
  onPosition,
  assignments,
}: MainProps) {
  return (
    <View style={styles.mapWrapper}>
      <View style={styles.header}>
        <Text style={styles.title}>Main Sanctuary</Text>
        <Text style={styles.subtitle}>{serviceTime} Service</Text>
      </View>
      <Image
        source={require("assets/images/home_church.png")}
        resizeMode="contain"
        style={styles.watermark}
      />
      <Svg
        height="100%"
        width="100%"
        viewBox="0 0 400 700"
        preserveAspectRatio="xMidYMid meet"
        style={styles.svg}
      >
        {/* Chair Rows (center) */}
        {Array.from({ length: 8 }).map((_, i) => (
          <Rect
            key={`row-left-${i}`}
            x="120"
            y={180 + i * 30}
            width="80"
            height="10"
            stroke="rgba(212,190,143,0.9)"
            fill="none"
          />
        ))}

        {Array.from({ length: 8 }).map((_, i) => (
          <Rect
            key={`row-right-${i}`}
            x="210"
            y={180 + i * 30}
            width="80"
            height="10"
            stroke="rgba(212,190,143,0.9)"
            fill="none"
          />
        ))}

        {/* Left side (angled inward) */}
        {Array.from({ length: 6 }).map((_, i) => {
          const x = 30;
          const y = 170 + i * 40;
          const width = 60;
          const height = 8;

          const cx = x + width / 2;
          const cy = y + height / 2;

          return (
            <Rect
              key={`left-side-${i}`}
              x={x}
              y={y}
              width={width}
              height={height}
              stroke="rgba(212,190,143,0.9)"
              fill="none"
              transform={`rotate(20, ${cx}, ${cy})`}
            />
          );
        })}

        {/* Right side (angled inward) */}
        {Array.from({ length: 6 }).map((_, i) => {
          const x = 310;
          const y = 170 + i * 40;
          const width = 60;
          const height = 8;

          const cx = x + width / 2;
          const cy = y + height / 2;

          return (
            <Rect
              key={`right-side-${i}`}
              x={x}
              y={y}
              width={width}
              height={height}
              stroke="rgba(212,190,143,0.9)"
              fill="none"
              transform={`rotate(-20, ${cx}, ${cy})`}
            />
          );
        })}

        {/* Bottom Tables */}
        <Rect
          x="80"
          y="550"
          width="100"
          height="10"
          stroke="rgba(212,190,143,0.9)"
          fill="none"
        />
        <Rect
          x="200"
          y="550"
          width="100"
          height="10"
          stroke="rgba(212,190,143,0.9)"
          fill="none"
        />
        <Rect
          x="320"
          y="550"
          width="60"
          height="10"
          stroke="rgba(212,190,143,0.9)"
          fill="none"
        />

        {/* Positions */}
        <PositionList
          serviceId={serviceId}
          modalVisible={modalVisible}
          onAssign={onAssign}
          onClear={onClear}
          onPosition={onPosition}
          onModalVisible={onModalVisible}
          assignments={assignments}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  mapWrapper: {
    flex: 1,
    backgroundColor: "black",
    position: "relative",
    overflow: "hidden",
  },

  watermark: {
    position: "absolute",
    width: "70%",
    height: "70%",
    left: "15%",
    top: "8%",
    opacity: 0.14,
  },

  svg: {
    position: "absolute",
    inset: 0,
  },

  header: {
    position: "absolute",
    top: 24,
    left: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: "rgba(17,17,17,0.85)",
    borderWidth: 1,
    borderColor: "rgba(212,190,143,0.45)",
    borderRadius: 18,
    padding: 14,
  },

  title: {
    color: "#D4BE8F",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 1,
  },

  subtitle: {
    color: "#9CA3AF",
    fontSize: 13,
    marginTop: 4,
  },
});
