import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TurnListPanel } from '../turn-list-panel';
import { Turn } from '../../utils/turn-utils';
import { ChatMessage } from '../agent-chat-panel';

describe('TurnListPanel', () => {
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
    it('renders turn list from turns prop', () => {
      const turns = [
        createMockTurn({ id: 'turn-0', userMessage: { role: 'user', content: 'First design' } as ChatMessage }),
        createMockTurn({ id: 'turn-1', userMessage: { role: 'user', content: 'Second design' } as ChatMessage }),
      ];
      const onSelectTurn = vi.fn();

      render(
        <TurnListPanel
          turns={turns}
          selectedTurnId="turn-0"
          onSelectTurn={onSelectTurn}
          isVisible={true}
          onClose={vi.fn()}
        />
      );

      expect(screen.getByText('First design')).toBeInTheDocument();
      expect(screen.getByText('Second design')).toBeInTheDocument();
    });

    it('shows empty state when no turns provided', () => {
      const onSelectTurn = vi.fn();

      render(
        <TurnListPanel
          turns={[]}
          selectedTurnId={undefined}
          onSelectTurn={onSelectTurn}
          isVisible={true}
          onClose={vi.fn()}
        />
      );

      expect(screen.getByText(/no turns yet|empty/i)).toBeInTheDocument();
    });

    it('does not render when isVisible is false', () => {
      const turns = [createMockTurn()];
      const onSelectTurn = vi.fn();

      const { container } = render(
        <TurnListPanel
          turns={turns}
          selectedTurnId="turn-0"
          onSelectTurn={onSelectTurn}
          isVisible={false}
          onClose={vi.fn()}
        />
      );

      // Panel should not be visible in DOM or should have display: none
      const panel = container.querySelector('[data-testid="turn-list-panel"]');
      if (panel) {
        expect(panel).toHaveStyle({ display: 'none' });
      }
    });
  });

  describe('turn title truncation', () => {
    it('truncates long turn titles', () => {
      const longTitle = 'A'.repeat(100);
      const turns = [
        createMockTurn({
          id: 'turn-0',
          userMessage: { role: 'user', content: longTitle } as ChatMessage,
        }),
      ];
      const onSelectTurn = vi.fn();

      render(
        <TurnListPanel
          turns={turns}
          selectedTurnId="turn-0"
          onSelectTurn={onSelectTurn}
          isVisible={true}
          onClose={vi.fn()}
        />
      );

      const turnItem = screen.getByText(new RegExp(longTitle.substring(0, 50)));
      expect(turnItem.textContent).toHaveLength(50);
    });

    it('displays full title for short turn content', () => {
      const shortTitle = 'Create a card';
      const turns = [
        createMockTurn({
          id: 'turn-0',
          userMessage: { role: 'user', content: shortTitle } as ChatMessage,
        }),
      ];
      const onSelectTurn = vi.fn();

      render(
        <TurnListPanel
          turns={turns}
          selectedTurnId="turn-0"
          onSelectTurn={onSelectTurn}
          isVisible={true}
          onClose={vi.fn()}
        />
      );

      expect(screen.getByText(shortTitle)).toBeInTheDocument();
    });
  });

  describe('turn selection', () => {
    it('highlights selected turn', () => {
      const turns = [
        createMockTurn({ id: 'turn-0', userMessage: { role: 'user', content: 'First' } as ChatMessage }),
        createMockTurn({ id: 'turn-1', userMessage: { role: 'user', content: 'Second' } as ChatMessage }),
      ];
      const onSelectTurn = vi.fn();

      render(
        <TurnListPanel
          turns={turns}
          selectedTurnId="turn-1"
          onSelectTurn={onSelectTurn}
          isVisible={true}
          onClose={vi.fn()}
        />
      );

      const selectedItem = screen.getByRole('button', { name: /Second/i });
      expect(selectedItem).toHaveClass('selected');
    });

    it('calls onSelectTurn when turn is clicked', () => {
      const turns = [
        createMockTurn({ id: 'turn-0', userMessage: { role: 'user', content: 'First' } as ChatMessage }),
        createMockTurn({ id: 'turn-1', userMessage: { role: 'user', content: 'Second' } as ChatMessage }),
      ];
      const onSelectTurn = vi.fn();

      render(
        <TurnListPanel
          turns={turns}
          selectedTurnId="turn-0"
          onSelectTurn={onSelectTurn}
          isVisible={true}
          onClose={vi.fn()}
        />
      );

      const secondTurnButton = screen.getByRole('button', { name: /Second/i });
      fireEvent.click(secondTurnButton);

      expect(onSelectTurn).toHaveBeenCalledWith(turns[1]);
      expect(onSelectTurn).toHaveBeenCalledTimes(1);
    });

    it('does not call onSelectTurn when already selected turn is clicked', () => {
      const turns = [createMockTurn({ id: 'turn-0', userMessage: { role: 'user', content: 'First' } as ChatMessage })];
      const onSelectTurn = vi.fn();

      render(
        <TurnListPanel
          turns={turns}
          selectedTurnId="turn-0"
          onSelectTurn={onSelectTurn}
          isVisible={true}
          onClose={vi.fn()}
        />
      );

      const turnButton = screen.getByRole('button', { name: /First/i });
      fireEvent.click(turnButton);

      expect(onSelectTurn).not.toHaveBeenCalled();
    });
  });

  describe('marquee scroll on hover', () => {
    it('applies marquee scroll class on hover for long titles', () => {
      const longTitle = 'A'.repeat(100);
      const turns = [
        createMockTurn({
          id: 'turn-0',
          userMessage: { role: 'user', content: longTitle } as ChatMessage,
        }),
      ];
      const onSelectTurn = vi.fn();

      render(
        <TurnListPanel
          turns={turns}
          selectedTurnId="turn-0"
          onSelectTurn={onSelectTurn}
          isVisible={true}
          onClose={vi.fn()}
        />
      );

      const turnItem = screen.getByRole('button', { name: new RegExp(longTitle.substring(0, 50)) });
      fireEvent.mouseEnter(turnItem);

      expect(turnItem).toHaveClass('marquee-scroll');
    });

    it('removes marquee scroll class on mouse leave', () => {
      const longTitle = 'A'.repeat(100);
      const turns = [
        createMockTurn({
          id: 'turn-0',
          userMessage: { role: 'user', content: longTitle } as ChatMessage,
        }),
      ];
      const onSelectTurn = vi.fn();

      render(
        <TurnListPanel
          turns={turns}
          selectedTurnId="turn-0"
          onSelectTurn={onSelectTurn}
          isVisible={true}
          onClose={vi.fn()}
        />
      );

      const turnItem = screen.getByRole('button', { name: new RegExp(longTitle.substring(0, 50)) });
      fireEvent.mouseEnter(turnItem);
      fireEvent.mouseLeave(turnItem);

      expect(turnItem).not.toHaveClass('marquee-scroll');
    });
  });

  describe('close button', () => {
    it('calls onClose when close button is clicked', () => {
      const turns = [createMockTurn()];
      const onClose = vi.fn();

      render(
        <TurnListPanel
          turns={turns}
          selectedTurnId="turn-0"
          onSelectTurn={vi.fn()}
          isVisible={true}
          onClose={onClose}
        />
      );

      const closeButton = screen.getByRole('button', { name: /close|×/i });
      fireEvent.click(closeButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('turn with designId', () => {
    it('displays turn with designId from userMessage', () => {
      const turns = [
        createMockTurn({
          id: 'turn-0',
          userMessage: { role: 'user', content: 'Design 1', designId: 'design-123' } as ChatMessage,
          designId: 'design-123',
        }),
      ];
      const onSelectTurn = vi.fn();

      render(
        <TurnListPanel
          turns={turns}
          selectedTurnId="turn-0"
          onSelectTurn={onSelectTurn}
          isVisible={true}
          onClose={vi.fn()}
        />
      );

      expect(screen.getByText('Design 1')).toBeInTheDocument();
    });

    it('displays turn with designId from assistantMessage when userMessage lacks it', () => {
      const turns = [
        createMockTurn({
          id: 'turn-0',
          userMessage: { role: 'user', content: 'Design 2' } as ChatMessage,
          assistantMessage: { role: 'assistant', content: 'Response', designId: 'design-456' } as ChatMessage,
          designId: 'design-456',
        }),
      ];
      const onSelectTurn = vi.fn();

      render(
        <TurnListPanel
          turns={turns}
          selectedTurnId="turn-0"
          onSelectTurn={onSelectTurn}
          isVisible={true}
          onClose={vi.fn()}
        />
      );

      expect(screen.getByText('Design 2')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('renders turn items as buttons for keyboard navigation', () => {
      const turns = [createMockTurn({ id: 'turn-0', userMessage: { role: 'user', content: 'First' } as ChatMessage })];
      const onSelectTurn = vi.fn();

      render(
        <TurnListPanel
          turns={turns}
          selectedTurnId="turn-0"
          onSelectTurn={onSelectTurn}
          isVisible={true}
          onClose={vi.fn()}
        />
      );

      const turnButton = screen.getByRole('button', { name: /First/i });
      expect(turnButton).toBeInTheDocument();
    });

    it('has aria-label for close button', () => {
      const turns = [createMockTurn()];

      render(
        <TurnListPanel
          turns={turns}
          selectedTurnId="turn-0"
          onSelectTurn={vi.fn()}
          isVisible={true}
          onClose={vi.fn()}
        />
      );

      const closeButton = screen.getByRole('button', { name: /close|×/i });
      expect(closeButton).toHaveAttribute('aria-label');
    });
  });
});
