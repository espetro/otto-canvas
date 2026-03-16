/** Pipeline stages for multi-model generation */

export type PipelineStage =
  | "queued"
  | "layout"
  | "images"
  | "compositing"
  | "review"
  | "refining"
  | "done"
  | "error";

export interface PipelineStatus {
  stage: PipelineStage;
  progress: number; // 0-1
  skipped?: boolean;
  reason?: string;
}
