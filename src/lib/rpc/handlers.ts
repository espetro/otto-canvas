import type {
  GenerateRequest,
  GenerateResponse,
  RefineRequest,
  RefineResponse,
  ListRequest,
  ListResponse,
  SelectRequest,
  SelectResponse,
  Design,
} from "@/gen/proto/canvas";

const designs = new Map<string, Design>();
let designCounter = 0;

export const canvasServiceImpl = {
  async generate(req: GenerateRequest): Promise<GenerateResponse> {
    const designId = `design_${++designCounter}`;
    const design: Design = {
      id: designId,
      prompt: req.prompt,
      htmlContent: `<div>Design for: ${req.prompt}</div>`,
      createdAt: Date.now(),
    };
    designs.set(designId, design);

    return {
      designId,
      status: "completed",
      designs: [design],
    };
  },

  async refine(req: RefineRequest): Promise<RefineResponse> {
    const design = designs.get(req.designId);
    if (!design) {
      throw new Error(`Design not found: ${req.designId}`);
    }

    design.htmlContent += `<!-- Refined with: ${req.feedback} -->`;
    return {
      designId: req.designId,
      status: "completed",
    };
  },

  async list(_req: ListRequest): Promise<ListResponse> {
    return {
      designs: Array.from(designs.values()),
    };
  },

  async select(req: SelectRequest): Promise<SelectResponse> {
    const design = designs.get(req.designId);
    return {
      success: !!design,
    };
  },
};
