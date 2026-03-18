import { ChatMessage } from "../components/agent-chat-panel";

export interface Turn {
  id: string;
  userMessage: ChatMessage;
  assistantMessage?: ChatMessage;
  designId?: string;
}

/**
 * Groups chat messages into turns (user + assistant pairs)
 * Each turn is identified by a unique ID based on the user message index
 * 
 * @param messages - Array of chat messages to group
 * @returns Array of Turn objects with paired messages
 * 
 * @example
 * const messages = [
 *   { role: 'user', content: 'Hello' },
 *   { role: 'assistant', content: 'Hi there!' }
 * ];
 * const turns = groupMessagesByTurns(messages);
 * // Returns: [{ id: 'turn-0', userMessage: {...}, assistantMessage: {...} }]
 */
export const groupMessagesByTurns = (messages: ChatMessage[]): Turn[] => {
  if (messages.length === 0) {
    return [];
  }

  const turns: Turn[] = [];
  let turnIndex = 0;
  let i = 0;

  while (i < messages.length) {
    const message = messages[i];

    if (message.role === "user") {
      const userMessage = message;
      
      // Check if the immediately next message is an assistant message
      let assistantMessage: ChatMessage | undefined;
      if (i + 1 < messages.length && messages[i + 1].role === "assistant") {
        assistantMessage = messages[i + 1];
        i += 2; // Skip both user and assistant
      } else {
        i += 1; // Skip only the user message
      }

      const turn: Turn = {
        id: `turn-${turnIndex}`,
        userMessage,
        assistantMessage,
        designId: userMessage.designId || assistantMessage?.designId,
      };

      turns.push(turn);
      turnIndex++;
    } else {
      // Skip assistant messages that aren't paired with a user message
      i += 1;
    }
  }

  return turns;
};
