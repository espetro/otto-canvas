import { describe, it, expect } from "vitest";
import { groupMessagesByTurns, type Turn } from "../turn-utils";
import type { ChatMessage } from "../../components/agent-chat-panel";

describe("groupMessagesByTurns", () => {
  it("returns empty array for empty messages", () => {
    const result = groupMessagesByTurns([]);
    expect(result).toEqual([]);
  });

  it("groups paired user and assistant messages into a single turn", () => {
    const messages: ChatMessage[] = [
      { role: "user", content: "Hello" },
      { role: "assistant", content: "Hi there!" },
    ];

    const result = groupMessagesByTurns(messages);

    expect(result).toHaveLength(1);
    expect(result[0].userMessage).toEqual(messages[0]);
    expect(result[0].assistantMessage).toEqual(messages[1]);
    expect(result[0].id).toBeDefined();
  });

  it("handles orphan user message without assistant response", () => {
    const messages: ChatMessage[] = [
      { role: "user", content: "Hello" },
    ];

    const result = groupMessagesByTurns(messages);

    expect(result).toHaveLength(1);
    expect(result[0].userMessage).toEqual(messages[0]);
    expect(result[0].assistantMessage).toBeUndefined();
  });

  it("groups multiple turns correctly", () => {
    const messages: ChatMessage[] = [
      { role: "user", content: "First question" },
      { role: "assistant", content: "First answer" },
      { role: "user", content: "Second question" },
      { role: "assistant", content: "Second answer" },
    ];

    const result = groupMessagesByTurns(messages);

    expect(result).toHaveLength(2);
    expect(result[0].userMessage.content).toBe("First question");
    expect(result[0].assistantMessage?.content).toBe("First answer");
    expect(result[1].userMessage.content).toBe("Second question");
    expect(result[1].assistantMessage?.content).toBe("Second answer");
  });

  it("handles mixed turns with some orphaned user messages", () => {
    const messages: ChatMessage[] = [
      { role: "user", content: "First question" },
      { role: "assistant", content: "First answer" },
      { role: "user", content: "Second question" },
    ];

    const result = groupMessagesByTurns(messages);

    expect(result).toHaveLength(2);
    expect(result[0].userMessage.content).toBe("First question");
    expect(result[0].assistantMessage?.content).toBe("First answer");
    expect(result[1].userMessage.content).toBe("Second question");
    expect(result[1].assistantMessage).toBeUndefined();
  });

  it("preserves designId from user message", () => {
    const messages: ChatMessage[] = [
      { role: "user", content: "Hello", designId: "design-123" },
      { role: "assistant", content: "Hi there!" },
    ];

    const result = groupMessagesByTurns(messages);

    expect(result[0].designId).toBe("design-123");
  });

  it("generates unique IDs for each turn", () => {
    const messages: ChatMessage[] = [
      { role: "user", content: "First" },
      { role: "assistant", content: "Answer 1" },
      { role: "user", content: "Second" },
      { role: "assistant", content: "Answer 2" },
    ];

    const result = groupMessagesByTurns(messages);

    expect(result[0].id).not.toBe(result[1].id);
  });

  it("handles consecutive user messages (second user message starts new turn)", () => {
    const messages: ChatMessage[] = [
      { role: "user", content: "First question" },
      { role: "user", content: "Second question" },
      { role: "assistant", content: "Answer" },
    ];

    const result = groupMessagesByTurns(messages);

    expect(result).toHaveLength(2);
    expect(result[0].userMessage.content).toBe("First question");
    expect(result[0].assistantMessage).toBeUndefined();
    expect(result[1].userMessage.content).toBe("Second question");
    expect(result[1].assistantMessage?.content).toBe("Answer");
  });
});
