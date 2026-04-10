import { z } from "zod";

export const OverlaySchema = z.object({
  text: z.string(),
  startSeconds: z.number().min(0),
  endSeconds: z.number().min(0),
  position: z.enum(["top-center", "center", "bottom-third"]),
  animation: z.enum(["fade-in", "slide-down", "flash", "end-card"]),
  fontSize: z.number().optional().default(48),
  fontWeight: z.number().optional().default(700),
  color: z.string().optional().default("white"),
  backgroundColor: z.string().optional(),
});

export const RenderConfigSchema = z.object({
  inputVideoPath: z.string(),
  outputPath: z.string(),
  width: z.number().int().positive().optional().default(1080),
  height: z.number().int().positive().optional().default(1920),
  fps: z.number().positive().optional().default(30),
  durationInSeconds: z.number().positive().optional(),
  overlays: z.array(OverlaySchema),
});

export type Overlay = z.infer<typeof OverlaySchema>;
export type RenderConfig = z.infer<typeof RenderConfigSchema>;

export const ConfigurableVideoSchema = z.object({
  videoFileName: z.string(),
  overlays: z.array(OverlaySchema),
});

export type ConfigurableVideoProps = z.infer<typeof ConfigurableVideoSchema>;
