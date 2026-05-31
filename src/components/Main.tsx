import { View, ImageBackground } from "react-native";
import Svg, { Rect } from "react-native-svg";
import PositionList from "./PositionList";
import UsersModal from "./UsersModal";
import type { AssignmentWithRelations } from "@/types";

interface MainProps {
  serviceId: string;
  modalVisible: boolean;
  onModalVisible: (modal: boolean) => void;
  onAssign: (profileId: string) => void;
  onClear: () => void;
  onPosition: (position: string) => void;
  assignments?: AssignmentWithRelations[];
}

export default function Main({
  serviceId,
  modalVisible,
  onModalVisible,
  onAssign,
  onClear,
  onPosition,
  assignments,
}: MainProps) {
  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <ImageBackground
        source={require("assets/images/home_church.png")}
        resizeMode="repeat"
        style={{ flex: 1 }}
      >
        <Svg height="100%" width="100%" viewBox="0 0 400 700">
          {/* Chair Rows (center) */}
          {Array.from({ length: 8 }).map((_, i) => (
            <Rect
              key={`row-left-${i}`}
              x="120"
              y={180 + i * 30}
              width="80"
              height="10"
              stroke="white"
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
              stroke="white"
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
                stroke="white"
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
                stroke="white"
                fill="none"
                transform={`rotate(-20, ${cx}, ${cy})`}
              />
            );
          })}

          {/* Bottom Tables */}
          <Rect
            x="80"
            y="600"
            width="100"
            height="10"
            stroke="white"
            fill="none"
          />
          <Rect
            x="200"
            y="600"
            width="100"
            height="10"
            stroke="white"
            fill="none"
          />
          <Rect
            x="320"
            y="600"
            width="60"
            height="10"
            stroke="white"
            fill="none"
          />

          {/* User selection modal */}
          <UsersModal
            modalVisible={modalVisible}
            onModalVisible={onModalVisible}
            onAssign={onAssign}
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
      </ImageBackground>
    </View>
  );
}
