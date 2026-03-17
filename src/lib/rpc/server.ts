import { createConnectTransport } from '@connectrpc/connect-node';

export const createRPCClient = () => {
  const transport = createConnectTransport({
    baseUrl: 'http://localhost:3000',
    httpVersion: '2',
  });

  return null;
};

export interface GenerateRequest {
  prompt: string;
  iterations: number;
  style: string;
}

export interface GenerateResponse {
  designId: string;
  status: string;
  designs: Design[];
}

export interface RefineRequest {
  designId: string;
  feedback: string;
}

export interface RefineResponse {
  designId: string;
  status: string;
}

export interface ListRequest {}

export interface ListResponse {
  designs: Design[];
}

export interface SelectRequest {
  designId: string;
}

export interface SelectResponse {
  success: boolean;
}

export interface Design {
  id: string;
  prompt: string;
  htmlContent: string;
  createdAt: number;
}

export type RPCService = {
  generate: (req: GenerateRequest) => Promise<GenerateResponse>;
  refine: (req: RefineRequest) => Promise<RefineResponse>;
  list: (req: ListRequest) => Promise<ListResponse>;
  select: (req: SelectRequest) => Promise<SelectResponse>;
};
