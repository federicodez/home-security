import React from "react";
import Svg, { Rect, Text as SvgText } from "react-native-svg";

type Props = {
  x?: number;
  y?: number;
};

export default function Legend({ x = 260, y = 300 }: Props) {
  return (
    <>
      <Rect x={x} y={y} width="120" height="150" stroke="white" fill="none" />

      <SvgText x={x + 10} y={y + 20} fill="white" fontSize="12">
        LEGEND
      </SvgText>

      <SvgText x={x + 10} y={y + 40} fill="lime" fontSize="10">
        Building
      </SvgText>

      <SvgText x={x + 10} y={y + 60} fill="red" fontSize="10">
        Donation Table
      </SvgText>

      <SvgText x={x + 10} y={y + 80} fill="yellow" fontSize="10">
        Stage
      </SvgText>

      <SvgText x={x + 10} y={y + 100} fill="cyan" fontSize="10">
        Entry/Exit
      </SvgText>

      <SvgText x={x + 10} y={y + 120} fill="white" fontSize="10">
        Chairs
      </SvgText>

      <SvgText x={x + 10} y={y + 140} fill="magenta" fontSize="10">
        Positions
      </SvgText>
    </>
  );
}
