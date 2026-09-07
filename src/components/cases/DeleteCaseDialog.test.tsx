import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ExpertCase } from '../../domain/case';
import { DeleteCaseDialog } from './DeleteCaseDialog';

const expertCase: ExpertCase = {
  id: '00000000-0000-4000-8000-000000000001',
  title: 'Кейс для удаления',
  module: 'Genre',
  model: 'Sol',
  response: 'Ответ',
  status: 'review',
  createdAt: '2026-09-07T10:00:00.000Z',
  updatedAt: '2026-09-07T10:00:00.000Z',
};

describe('DeleteCaseDialog request state', () => {
  it('blocks repeated deletion while the request is pending', async () => {
    let resolveDelete!: (deleted: boolean) => void;
    const onConfirm = vi.fn(() => new Promise<boolean>((resolve) => {
      resolveDelete = resolve;
    }));
    const onClose = vi.fn();

    render(<DeleteCaseDialog item={expertCase} onClose={onClose} onConfirm={onConfirm} />);
    const deleteButton = screen.getByRole('button', { name: 'Удалить' });
    fireEvent.click(deleteButton);
    fireEvent.click(deleteButton);

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Удаление…' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Отмена' })).toBeDisabled();

    await act(async () => resolveDelete(false));
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Удалить' })).toBeEnabled();
    expect(screen.getByRole('alert')).toHaveTextContent('Не удалось удалить кейс');
  });
});
