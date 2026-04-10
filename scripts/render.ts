import fs from "node:fs";
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { enableTailwind } from "@remotion/tailwind-v4";
import { RenderConfigSchema } from "../src/config-schema";

const COMPOSITION_ID = "ConfigurableVideo";

async function main() {
  const configPath = process.argv[2];
  if (!configPath) {
    console.error("Usage: npm run render -- <config.json>");
    process.exit(1);
  }

  const absoluteConfigPath = path.resolve(configPath);
  if (!fs.existsSync(absoluteConfigPath)) {
    console.error(`Config file not found: ${absoluteConfigPath}`);
    process.exit(1);
  }

  // Parse and validate config
  const raw = JSON.parse(fs.readFileSync(absoluteConfigPath, "utf-8"));
  const result = RenderConfigSchema.safeParse(raw);
  if (!result.success) {
    console.error("Invalid config:");
    for (const issue of result.error.issues) {
      console.error(`  ${issue.path.join(".")}: ${issue.message}`);
    }
    process.exit(1);
  }
  const config = result.data;

  // Resolve input video path relative to the config file
  const inputVideoAbsolute = path.isAbsolute(config.inputVideoPath)
    ? config.inputVideoPath
    : path.resolve(path.dirname(absoluteConfigPath), config.inputVideoPath);

  if (!fs.existsSync(inputVideoAbsolute)) {
    console.error(`Input video not found: ${inputVideoAbsolute}`);
    process.exit(1);
  }

  // Copy video to public/ so staticFile() can find it
  const publicDir = path.resolve(__dirname, "..", "public");
  fs.mkdirSync(publicDir, { recursive: true });
  const videoFileName = `render-input-${Date.now()}.mp4`;
  const videoDest = path.join(publicDir, videoFileName);
  console.log(`Copying video to ${videoDest}`);
  fs.copyFileSync(inputVideoAbsolute, videoDest);

  // Resolve output path relative to config file
  const outputAbsolute = path.isAbsolute(config.outputPath)
    ? config.outputPath
    : path.resolve(path.dirname(absoluteConfigPath), config.outputPath);
  fs.mkdirSync(path.dirname(outputAbsolute), { recursive: true });

  const fps = config.fps;
  const durationInFrames = config.durationInSeconds
    ? Math.ceil(config.durationInSeconds * fps)
    : 1800;

  const inputProps = {
    videoFileName,
    overlays: config.overlays,
  };

  try {
    // Bundle the project
    console.log("Bundling project...");
    const entryPoint = path.resolve(__dirname, "..", "src", "index.ts");
    const bundled = await bundle({
      entryPoint,
      webpackOverride: enableTailwind,
    });

    // Select composition with overrides
    console.log("Selecting composition...");
    const composition = await selectComposition({
      serveUrl: bundled,
      id: COMPOSITION_ID,
      inputProps,
    });
    composition.width = config.width;
    composition.height = config.height;
    composition.fps = fps;
    composition.durationInFrames = durationInFrames;

    // Render
    console.log(
      `Rendering ${composition.durationInFrames} frames at ${fps}fps (${config.width}x${config.height})...`,
    );
    console.log(`Overlays: ${config.overlays.length}`);

    await renderMedia({
      composition,
      serveUrl: bundled,
      codec: "h264",
      outputLocation: outputAbsolute,
      inputProps,
      onProgress: ({ progress }) => {
        const pct = Math.round(progress * 100);
        process.stdout.write(`\rRendering: ${pct}%`);
      },
    });

    console.log(`\nDone! Output saved to ${outputAbsolute}`);
  } finally {
    // Clean up the copied video
    if (fs.existsSync(videoDest)) {
      fs.unlinkSync(videoDest);
    }
  }
}

main().catch((err) => {
  console.error("Render failed:", err);
  process.exit(1);
});
