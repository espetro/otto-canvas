import React from 'react';
import { Box, Text } from 'ink';
import { Spinner } from './Spinner.js';

interface ProgressProps {
  message: string;
  isComplete?: boolean;
}

export function Progress({ message, isComplete }: ProgressProps) {
  return (
    <Box>
      {isComplete ? (
        <Text color="green">✓ </Text>
      ) : (
        <Text color="blue"><Spinner /></Text>
      )}
      <Text>{message}</Text>
    </Box>
  );
}
