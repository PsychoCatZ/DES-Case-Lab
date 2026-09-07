import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CaseForm } from './CaseForm';

describe('CaseForm request state', () => {
  it('blocks repeated submission while saving', async () => {
    let resolveSubmit!: (saved: boolean) => void;
    const onSubmit = vi.fn(() => new Promise<boolean>((resolve) => {
      resolveSubmit = resolve;
    }));
    const onClose = vi.fn();

    render(<CaseForm open item={null} onClose={onClose} onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText('Название или краткое описание'), {
      target: { value: 'Кейс' },
    });
    fireEvent.change(screen.getByLabelText('Ответ модели'), {
      target: { value: 'Ответ' },
    });

    const form = document.getElementById('case-editor-form');
    expect(form).not.toBeNull();
    fireEvent.submit(form!);
    fireEvent.submit(form!);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Сохранение…' })).toBeDisabled();

    await act(async () => resolveSubmit(true));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
