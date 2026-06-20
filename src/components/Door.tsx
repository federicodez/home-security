import { G, Line, Path } from "react-native-svg";

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

export default Door;
