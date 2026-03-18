import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ChatDialog } from '../chat-dialog';
import { Turn } from '../../utils/turn-utils';
import { ChatMessage } from '../agent-chat-panel';

describe('ChatDialog', () => {
  const createMockTurn = (overrides?: Partial<Turn>): Turn => ({
    id: 'turn-0',
    userMessage: {
      role: 'user',
      content: 'Create a button component',
    } as ChatMessage,
    assistantMessage: {
      role: 'assistant',
      content: 'Here is a button component',
    } as ChatMessage,
    ...overrides,
  });

  describe('rendering', () => {
    it('renders dialog with turn content when visible', () => {
      const turn = createMockTurn({
        userMessage: { role: 'user', content: 'Design a card' } as ChatMessage,
        assistantMessage: { role: 'assistant', content: 'Here is a card design' } as ChatMessage,
      });

      render(
        <ChatDialog
          turn={turn}
          isVisible={true}
          onClose={vi.fn()}
        />
      );

      expect(screen.getByText('Design a card')).toBeInTheDocument();
      expect(screen.getByText('Here is a card design')).toBeInTheDocument();
    });

    it('does not render when isVisible is false', () => {
      const turn = createMockTurn();
      const { container } = render(
        <ChatDialog
          turn={turn}
          isVisible={false}
          onClose={vi.fn()}
        />
      );

      const dialog = container.querySelector('[data-testid="chat-dialog"]');
      if (dialog) {
        expect(dialog).toHaveStyle({ display: 'none' });
      }
    });

    it('shows empty state when no turn provided', () => {
      render(
        <ChatDialog
          turn={undefined}
          isVisible={true}
          onClose={vi.fn()}
        />
      );

      expect(screen.getByText(/no message|empty|select a turn/i)).toBeInTheDocument();
    });
  });

  describe('user message display', () => {
    it('shows collapsed user message with fade effect', () => {
      const turn = createMockTurn({
        userMessage: { role: 'user', content: 'Create a pricing table' } as ChatMessage,
      });

      render(
        <ChatDialog
          turn={turn}
          isVisible={true}
          onClose={vi.fn()}
        />
      );

      const userMessage = screen.getByText('Create a pricing table');
      expect(userMessage).toBeInTheDocument();
      expect(userMessage.closest('[data-testid="user-message"]')).toHaveClass('fade');
    });

    it('expands user message on click', () => {
      const turn = createMockTurn({
        userMessage: { role: 'user', content: 'Create a pricing table' } as ChatMessage,
      });

      render(
        <ChatDialog
          turn={turn}
          isVisible={true}
          onClose={vi.fn()}
        />
      );

      const userMessage = screen.getByText('Create a pricing table').closest('[data-testid="user-message"]');
      fireEvent.click(userMessage!);

      expect(userMessage).toHaveClass('expanded');
    });

    it('collapses user message on second click', () => {
      const turn = createMockTurn({
        userMessage: { role: 'user', content: 'Create a pricing table' } as ChatMessage,
      });

      render(
        <ChatDialog
          turn={turn}
          isVisible={true}
          onClose={vi.fn()}
        />
      );

      const userMessage = screen.getByText('Create a pricing table').closest('[data-testid="user-message"]');
      fireEvent.click(userMessage!);
      fireEvent.click(userMessage!);

      expect(userMessage).not.toHaveClass('expanded');
    });
  });

  describe('assistant message display', () => {
    it('shows AI reply below user message', () => {
      const turn = createMockTurn({
        userMessage: { role: 'user', content: 'Design a button' } as ChatMessage,
        assistantMessage: { role: 'assistant', content: 'Here is a button design' } as ChatMessage,
      });

      render(
        <ChatDialog
          turn={turn}
          isVisible={true}
          onClose={vi.fn()}
        />
      );

      const userMessage = screen.getByText('Design a button');
      const assistantMessage = screen.getByText('Here is a button design');

      expect(userMessage).toBeInTheDocument();
      expect(assistantMessage).toBeInTheDocument();

      // Assistant message should appear after user message in DOM
      const userElement = userMessage.closest('[data-testid="user-message"]');
      const assistantElement = assistantMessage.closest('[data-testid="assistant-message"]');
      expect(userElement?.compareDocumentPosition(assistantElement!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });

    it('handles missing assistant message gracefully', () => {
      const turn = createMockTurn({
        userMessage: { role: 'user', content: 'Design a button' } as ChatMessage,
        assistantMessage: undefined,
      });

      render(
        <ChatDialog
          turn={turn}
          isVisible={true}
          onClose={vi.fn()}
        />
      );

      expect(screen.getByText('Design a button')).toBeInTheDocument();
      expect(screen.queryByTestId('assistant-message')).not.toBeInTheDocument();
    });
  });

  describe('close button', () => {
    it('calls onClose when close button is clicked', () => {
      const onClose = vi.fn();
      const turn = createMockTurn();

      render(
        <ChatDialog
          turn={turn}
          isVisible={true}
          onClose={onClose}
        />
      );

      const closeButton = screen.getByRole('button', { name: /close|×/i });
      fireEvent.click(closeButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('has aria-label for accessibility', () => {
      const turn = createMockTurn();

      render(
        <ChatDialog
          turn={turn}
          isVisible={true}
          onClose={vi.fn()}
        />
      );

      const closeButton = screen.getByRole('button', { name: /close|×/i });
      expect(closeButton).toHaveAttribute('aria-label');
    });
  });

  describe('visibility prop', () => {
    it('respects isVisible prop', () => {
      const turn = createMockTurn();
      const { rerender, container } = render(
        <ChatDialog
          turn={turn}
          isVisible={true}
          onClose={vi.fn()}
        />
      );

      expect(screen.getByText('Create a button component')).toBeInTheDocument();

      rerender(
        <ChatDialog
          turn={turn}
          isVisible={false}
          onClose={vi.fn()}
        />
      );

      const dialog = container.querySelector('[data-testid="chat-dialog"]');
      if (dialog) {
        expect(dialog).toHaveStyle({ display: 'none' });
      }
    });
  });

  describe('turn with designId', () => {
    it('displays turn with designId', () => {
      const turn = createMockTurn({
        id: 'turn-0',
        userMessage: { role: 'user', content: 'Design 1', designId: 'design-123' } as ChatMessage,
        designId: 'design-123',
      });

      render(
        <ChatDialog
          turn={turn}
          isVisible={true}
          onClose={vi.fn()}
        />
      );

      expect(screen.getByText('Design 1')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('renders user message as interactive element', () => {
      const turn = createMockTurn({
        userMessage: { role: 'user', content: 'Create a button' } as ChatMessage,
      });

      render(
        <ChatDialog
          turn={turn}
          isVisible={true}
          onClose={vi.fn()}
        />
      );

      const userMessage = screen.getByText('Create a button').closest('[data-testid="user-message"]');
      expect(userMessage).toHaveAttribute('role', 'button');
    });

    it('supports keyboard navigation on user message', () => {
      const turn = createMockTurn({
        userMessage: { role: 'user', content: 'Create a button' } as ChatMessage,
      });

      render(
        <ChatDialog
          turn={turn}
          isVisible={true}
          onClose={vi.fn()}
        />
      );

      const userMessage = screen.getByText('Create a button').closest('[data-testid="user-message"]');
      expect(userMessage).toHaveAttribute('tabIndex');
    });
  });

  describe('edge cases', () => {
    it('handles very long user message content', () => {
      const longContent = 'A'.repeat(500);
      const turn = createMockTurn({
        userMessage: { role: 'user', content: longContent } as ChatMessage,
      });

      render(
        <ChatDialog
          turn={turn}
          isVisible={true}
          onClose={vi.fn()}
        />
      );

      expect(screen.getByText(longContent)).toBeInTheDocument();
    });

    it('handles special characters in message content', () => {
      const specialContent = 'Create a <button> with "special" & characters';
      const turn = createMockTurn({
        userMessage: { role: 'user', content: specialContent } as ChatMessage,
      });

      render(
        <ChatDialog
          turn={turn}
          isVisible={true}
          onClose={vi.fn()}
        />
      );

      expect(screen.getByText(specialContent)).toBeInTheDocument();
    });

    it('handles empty string content', () => {
      const turn = createMockTurn({
        userMessage: { role: 'user', content: '' } as ChatMessage,
      });

      render(
        <ChatDialog
          turn={turn}
          isVisible={true}
          onClose={vi.fn()}
        />
      );

      const userMessage = screen.getByTestId('user-message');
      expect(userMessage).toBeInTheDocument();
    });
  });
});
