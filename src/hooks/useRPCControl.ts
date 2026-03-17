import { useEffect, useState } from 'react';
import { createRPCClient } from '@shared/lib/rpc/server';
import type { CanvasServiceClient } from '@shared/gen/proto/canvas';

export interface UseRPCControlOptions {
  onGenerate?: (prompt: string) => void;
  onRefine?: (designId: string, feedback: string) => void;
  onList?: () => void;
  onSelect?: (designId: string) => void;
}

export function useRPCControl(options: UseRPCControlOptions = {}) {
  const [client, setClient] = useState<CanvasServiceClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const rpcClient = createRPCClient();
    setClient(rpcClient);
    setIsConnected(true);

    // TODO: Set up WebSocket or HTTP/2 connection for receiving commands
    // This is a stub - full implementation requires ConnectRPC transport setup

    return () => {
      setIsConnected(false);
    };
  }, []);

  return {
    client,
    isConnected,
  };
}
