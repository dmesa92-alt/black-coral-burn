import "./index.css";
import { Composition } from "remotion";
import { BlackCoralBurn } from "./Composition";
import { ConfigurableVideo } from "./ConfigurableVideo";
import { ConfigurableVideoSchema } from "./config-schema";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BlackCoralBurn"
        component={BlackCoralBurn}
        durationInFrames={1800}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ConfigurableVideo"
        component={ConfigurableVideo}
        schema={ConfigurableVideoSchema}
        durationInFrames={1800}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          videoFileName: "video.mp4",
          overlays: [],
        }}
      />
    </>
  );
};
