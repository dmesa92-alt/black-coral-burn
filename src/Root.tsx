import "./index.css";
import { Composition } from "remotion";
import { BlackCoralBurn } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="BlackCoralBurn"
      component={BlackCoralBurn}
      durationInFrames={1800}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
