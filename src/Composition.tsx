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

const TopTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 0.3 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame, [0, 0.3 * fps], [-30, 0], {
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
        BLACK CORAL BURN 🔥
      </span>
    </div>
  );
};

const BottomThirdText: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 0.4 * fps], [0, 1], {
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
};

const FlashText: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const enterScale = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 200 },
  });

  const exitOpacity = interpolate(
    frame,
    [durationInFrames - 0.3 * fps, durationInFrames],
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
          textShadow: "0 0 40px rgba(255,100,0,0.6), 0 4px 20px rgba(0,0,0,0.7)",
          transform: `scale(${enterScale})`,
          letterSpacing: 3,
        }}
      >
        {text}
      </span>
    </AbsoluteFill>
  );
};

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  const textY = interpolate(frame, [0.3 * fps, 0.8 * fps], [30, 0], {
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
        BLACK CORAL BURN 🔥
      </span>
      <span
        style={{
          color: "#ff9500",
          fontSize: 40,
          fontWeight: 600,
          transform: `translateY(${textY}px)`,
        }}
      >
        Consíguelo ya — link de abajo
      </span>
    </AbsoluteFill>
  );
};

export const MyComposition: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {/* Video layer */}
      <AbsoluteFill>
        <Video
          src={staticFile("burn.mp4")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* Overlay layer */}
      <AbsoluteFill>
        {/* [0-3s] Title — top center */}
        <Sequence from={0} durationInFrames={3 * fps} layout="none">
          <TopTitle />
        </Sequence>

        {/* [3-8s] Subtitle — bottom third */}
        <Sequence from={3 * fps} durationInFrames={5 * fps} layout="none">
          <BottomThirdText text="4 semanas. Resultados reales." />
        </Sequence>

        {/* [15-18s] Flash — center */}
        <Sequence from={15 * fps} durationInFrames={3 * fps} premountFor={fps}>
          <FlashText text="TERMOGÉNESIS 🔥" />
        </Sequence>

        {/* [20-23s] Flash — center */}
        <Sequence from={20 * fps} durationInFrames={3 * fps} premountFor={fps}>
          <FlashText text="ENFOQUE MENTAL ⚡" />
        </Sequence>

        {/* [25-28s] Flash — center */}
        <Sequence from={25 * fps} durationInFrames={3 * fps} premountFor={fps}>
          <FlashText text="ENERGÍA PROLONGADA 💪" />
        </Sequence>

        {/* [30-35s] Testimonial — bottom third */}
        <Sequence from={30 * fps} durationInFrames={5 * fps} layout="none">
          <BottomThirdText text="Mi ropa ajusta diferente." />
        </Sequence>

        {/* [45-50s] Testimonial — bottom third */}
        <Sequence from={45 * fps} durationInFrames={5 * fps} layout="none">
          <BottomThirdText text="Ya es parte de mi rutina." />
        </Sequence>

        {/* [55-60s] End card — full screen */}
        <Sequence from={55 * fps} durationInFrames={5 * fps} premountFor={fps}>
          <EndCard />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
