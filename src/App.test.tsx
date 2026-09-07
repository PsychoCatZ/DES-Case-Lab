import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ExpertCase } from './domain/case';
import App from './App';

const expertCase: ExpertCase = {
  id: '00000000-0000-4000-8000-000000000001',
  title: 'Кейс после повторной загрузки',
  module: 'Scene',
  model: 'Astra',
  response: 'Ответ',
  status: 'accepted',
  createdAt: '2026-09-07T10:00:00.000Z',
  updatedAt: '2026-09-07T10:00:00.000Z',
};

describe('App network states', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('shows a network error and retries the API request', async () => {
    const fetchMock = vi.fn<typeof fetch>()
      .mockRejectedValueOnce(new TypeError('Failed to fetch'))
      .mockResolvedValueOnce(Response.json([expertCase]));
    vi.stubGlobal('fetch', fetchMock);

    render(<App />);

    expect(screen.getByText('Загрузка журнала…')).toBeInTheDocument();
    expect(await screen.findByRole('alert')).toHaveTextContent('Не удалось загрузить данные');
    fireEvent.click(screen.getByRole('button', { name: 'Повторить' }));

    expect(await screen.findAllByText(expertCase.title)).toHaveLength(2);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
