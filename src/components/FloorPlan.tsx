import { useState } from "react";
import { View, ImageBackground } from "react-native";
import Svg, { Rect, G } from "react-native-svg";
import UsersModal from "./UsersModal";
import { useAssignmentList, useUpdateAssignment } from "@/api/assignments";
import Position from "./Position";

interface FloorPlanProps {
  serviceId: string;
}

export default function FloorPlan({ serviceId }: FloorPlanProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [position, setPosition] = useState("");
  const { data: assignments } = useAssignmentList();
  const { mutate } = useUpdateAssignment();

  const handleAssign = (userId: string) => {
    try {
      mutate({ serviceId, station: position, userId });
    } catch {
      throw new Error("update failed");
    } finally {
      setModalVisible(false);
    }
  };

  const handleClear = () =>
    mutate({ serviceId, station: position, userId: null });

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <ImageBackground
        source={require("assets/images/home_church.png")}
        resizeMode="repeat"
        style={{ flex: 1 }}
      >
        <Svg height="100%" width="100%" viewBox="0 0 400 700">
          {/* Stage */}
          <Rect
            x="100"
            y="40"
            width="200"
            height="80"
            stroke="yellow"
            strokeWidth="2"
            fill="none"
          />

          {/* Stage Extension */}
          <Rect
            x="180"
            y="120"
            width="40"
            height="30"
            stroke="yellow"
            strokeWidth="2"
            fill="none"
          />

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
            onModalVisible={setModalVisible}
            onHandleAssign={handleAssign}
          />

          {/* Positions (Pink dots) */}
          {assignments?.map(
            ({
              user,
              position: { station, x, y },
              service: { id: service_id },
              id,
            }) => (
              <G key={id}>
                <Position
                  user={serviceId === service_id ? user : null}
                  station={station}
                  x={x}
                  y={y}
                  modalVisible={modalVisible}
                  onClear={handleClear}
                  onPosition={setPosition}
                  onModalVisible={setModalVisible}
                />
              </G>
            ),
          )}
        </Svg>
      </ImageBackground>
    </View>
  );
}
