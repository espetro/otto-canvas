import { useEffect, useRef, useState } from 'react';
import { rpcState } from '@shared/lib/rpc/state';
import type { GenerateRequest, RefineRequest, ListRequest, SelectRequest } from '@otto/types';

export interface UseRPCControlOptions {
  onGenerate?: (req: GenerateRequest) => Promise<void>;
  onRefine?: (req: RefineRequest) => Promise<void>;
    onList?: () => Promise<void>;
    onSelect?: (req: SelectRequest) => Promise<void>;
}

export function useRPCControl(options: UseRPCControlOptions = {}) {
  const [isConnected, setIsConnected] = useState(false);
    const eventSourceRef = useRef<EventSource | null>(null);
    const reconnectAttemptsRef = useRef(0);
    const messageHandlerRef = useRef<(event: MessageEvent) => void>(null);

    const eventSource = new EventSource('/api/rpc/events');

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        messageHandlerRef.current?.(data);
      } catch (error) {
        setError(`SSE error: ${error}`);
        setIsConnected(false);
      }
    });

    eventSource.onerror = () => {
      setError('SSE connection error');
      setIsConnected(false);
    };

    return () => {
      eventSource.close();
      rpcState.setBrowserConnected(false);
    };
  }, [options]);

  return {
    client,
    isConnected,
  };
}