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
import type { ConfigurableVideoProps, Overlay } from "./config-schema";

function FadeInOverlay({ overlay }: { overlay: Overlay }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });
  const positionStyle = getPositionStyle(overlay.position);
  return (
    <div style={{ ...positionStyle, opacity }}>
      <span
        style={{
          color: overlay.color,
          fontSize: overlay.fontSize,
          fontWeight: overlay.fontWeight,
          textShadow: "0 2px 16px rgba(0,0,0,0.8)",
        }}
      >
        {overlay.text}
      </span>
    </div>
  );
}

function SlideDownOverlay({ overlay }: { overlay: Overlay }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 9], [0, 1], {
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame, [0, 9], [-30, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const positionStyle = getPositionStyle(overlay.position);
  return (
    <div style={{ ...positionStyle, opacity, transform: `translateY(${y}px)` }}>
      <span
        style={{
          color: overlay.color,
          fontSize: overlay.fontSize,
          fontWeight: overlay.fontWeight,
          textShadow: "0 4px 20px rgba(0,0,0,0.7)",
          letterSpacing: 2,
        }}
      >
        {overlay.text}
      </span>
    </div>
  );
}

function FlashOverlay({ overlay }: { overlay: Overlay }) {
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
          color: overlay.color,
          fontSize: overlay.fontSize,
          fontWeight: overlay.fontWeight,
          textShadow:
            "0 0 40px rgba(255,100,0,0.6), 0 4px 20px rgba(0,0,0,0.7)",
          transform: `scale(${enterScale})`,
          letterSpacing: 3,
        }}
      >
        {overlay.text}
      </span>
    </AbsoluteFill>
  );
}

function EndCardOverlay({ overlay }: { overlay: Overlay }) {
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
        backgroundColor: overlay.backgroundColor || "black",
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
          color: overlay.color,
          fontSize: overlay.fontSize,
          fontWeight: overlay.fontWeight,
          letterSpacing: 2,
          transform: `translateY(${textY}px)`,
        }}
      >
        {overlay.text}
      </span>
    </AbsoluteFill>
  );
}

function getPositionStyle(
  position: Overlay["position"],
): React.CSSProperties {
  const base: React.CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
    padding: "0 40px",
  };
  switch (position) {
    case "top-center":
      return { ...base, top: 60 };
    case "center":
      return {
        ...base,
        top: 0,
        bottom: 0,
        alignItems: "center",
      };
    case "bottom-third":
      return { ...base, bottom: 120 };
  }
}

function OverlayRenderer({ overlay }: { overlay: Overlay }) {
  switch (overlay.animation) {
    case "fade-in":
      return <FadeInOverlay overlay={overlay} />;
    case "slide-down":
      return <SlideDownOverlay overlay={overlay} />;
    case "flash":
      return <FlashOverlay overlay={overlay} />;
    case "end-card":
      return <EndCardOverlay overlay={overlay} />;
  }
}

export const ConfigurableVideo: React.FC<ConfigurableVideoProps> = ({
  videoFileName,
  overlays,
}) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <AbsoluteFill>
        <Video
          src={staticFile(videoFileName)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      <AbsoluteFill>
        {overlays.map((overlay, i) => {
          const from = Math.round(overlay.startSeconds * fps);
          const duration = Math.round(
            (overlay.endSeconds - overlay.startSeconds) * fps,
          );
          const useLayout =
            overlay.animation === "flash" || overlay.animation === "end-card";
          return (
            <Sequence
              key={i}
              from={from}
              durationInFrames={duration}
              layout={useLayout ? "absolute-fill" : "none"}
            >
              <OverlayRenderer overlay={overlay} />
            </Sequence>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
