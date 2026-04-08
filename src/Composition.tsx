import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
  Easing,
} from "remotion";
import { Video } from "@remotion/media";

const FPS = 30;

function TopTitle() {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 9], [0, 1], {
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame, [0, 9], [-30, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 60,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      <span
        style={{
          color: "white",
          fontSize: 64,
          fontWeight: 800,
          textShadow: "0 4px 20px rgba(0,0,0,0.7)",
          letterSpacing: 2,
        }}
      >
        {"BLACK CORAL BURN \uD83D\uDD25"}
      </span>
    </div>
  );
}

function BottomThirdText({ text }: { text: string }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        bottom: 120,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity,
      }}
    >
      <span
        style={{
          color: "white",
          fontSize: 48,
          fontWeight: 600,
          textShadow: "0 2px 16px rgba(0,0,0,0.8)",
        }}
      >
        {text}
      </span>
    </div>
  );
}

function FlashText({ text }: { text: string }) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const enterScale = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 200 },
  });
  const exitOpacity = interpolate(
    frame,
    [durationInFrames - 9, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <AbsoluteFill
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        opacity: exitOpacity,
      }}
    >
      <span
        style={{
          color: "white",
          fontSize: 72,
          fontWeight: 800,
          textShadow:
            "0 0 40px rgba(255,100,0,0.6), 0 4px 20px rgba(0,0,0,0.7)",
          transform: `scale(${enterScale})`,
          letterSpacing: 3,
        }}
      >
        {text}
      </span>
    </AbsoluteFill>
  );
}

function EndCard() {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });
  const textY = interpolate(frame, [9, 24], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "black",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 40,
        opacity,
      }}
    >
      <span
        style={{
          color: "white",
          fontSize: 56,
          fontWeight: 800,
          letterSpacing: 2,
        }}
      >
        {"BLACK CORAL BURN \uD83D\uDD25"}
      </span>
      <span
        style={{
          color: "#ff9500",
          fontSize: 40,
          fontWeight: 600,
          transform: `translateY(${textY}px)`,
        }}
      >
        {"Cons\u00EDguelo ya \u2014 link de abajo"}
      </span>
    </AbsoluteFill>
  );
}

export const BlackCoralBurn: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <AbsoluteFill>
        <Video
          src={staticFile("burn.mp4")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      <AbsoluteFill>
        {/* [0-3s] Title */}
        <Sequence from={0} durationInFrames={3 * FPS} layout="none">
          <TopTitle />
        </Sequence>

        {/* [3-8s] Subtitle */}
        <Sequence from={3 * FPS} durationInFrames={5 * FPS} layout="none">
          <BottomThirdText text="4 semanas. Resultados reales." />
        </Sequence>

        {/* [15-18s] Flash */}
        <Sequence from={15 * FPS} durationInFrames={3 * FPS}>
          <FlashText text={"TERMOG\u00C9NESIS \uD83D\uDD25"} />
        </Sequence>

        {/* [20-23s] Flash */}
        <Sequence from={20 * FPS} durationInFrames={3 * FPS}>
          <FlashText text={"ENFOQUE MENTAL \u26A1"} />
        </Sequence>

        {/* [25-28s] Flash */}
        <Sequence from={25 * FPS} durationInFrames={3 * FPS}>
          <FlashText text={"ENERG\u00CDA PROLONGADA \uD83D\uDCAA"} />
        </Sequence>

        {/* [30-35s] Testimonial */}
        <Sequence from={30 * FPS} durationInFrames={5 * FPS} layout="none">
          <BottomThirdText text="Mi ropa ajusta diferente." />
        </Sequence>

        {/* [45-50s] Testimonial */}
        <Sequence from={45 * FPS} durationInFrames={5 * FPS} layout="none">
          <BottomThirdText text="Ya es parte de mi rutina." />
        </Sequence>

        {/* [55-60s] End card */}
        <Sequence from={55 * FPS} durationInFrames={5 * FPS}>
          <EndCard />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
