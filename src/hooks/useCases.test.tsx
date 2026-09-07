import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { CaseInput, ExpertCase } from '../domain/case';
import type { CaseRepository } from '../services/caseRepository';
import { useCases } from './useCases';

const input: CaseInput = {
  title: 'Новый кейс',
  module: 'Text',
  model: 'Sol',
  response: 'Ответ',
  status: 'review',
};

const expertCase: ExpertCase = {
  id: '00000000-0000-4000-8000-000000000001',
  ...input,
  createdAt: '2026-09-07T10:00:00.000Z',
  updatedAt: '2026-09-07T10:00:00.000Z',
};

function createRepository(): CaseRepository {
  return {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };
}

function CasesHarness({ repository }: { repository: CaseRepository }) {
  const {
    cases,
    isLoading,
    error,
    canRetry,
    retry,
    createCase,
  } = useCases(repository);

  return (
    <div>
      {isLoading && <span>Загрузка</span>}
      {error && <div role="alert">{error}</div>}
      {canRetry && <button onClick={() => void retry()}>Повторить</button>}
      <button onClick={() => void createCase(input)}>Создать</button>
      {cases.map((item) => <span key={item.id}>{item.title}</span>)}
    </div>
  );
}

describe('useCases network states', () => {
  it('shows loading until the initial request completes', async () => {
    const repository = createRepository();
    let resolveRequest!: (cases: ExpertCase[]) => void;
    vi.mocked(repository.getAll).mockReturnValue(new Promise((resolve) => {
      resolveRequest = resolve;
    }));

    render(<CasesHarness repository={repository} />);
    expect(screen.getByText('Загрузка')).toBeInTheDocument();

    await act(async () => resolveRequest([expertCase]));

    expect(screen.queryByText('Загрузка')).not.toBeInTheDocument();
    expect(screen.getByText(expertCase.title)).toBeInTheDocument();
  });

  it('shows an error and reloads data on retry', async () => {
    const repository = createRepository();
    vi.mocked(repository.getAll)
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce([expertCase]);

    render(<CasesHarness repository={repository} />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Не удалось загрузить данные');
    fireEvent.click(screen.getByRole('button', { name: 'Повторить' }));

    expect(await screen.findByText(expertCase.title)).toBeInTheDocument();
    expect(repository.getAll).toHaveBeenCalledTimes(2);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('keeps loaded cases when creation fails', async () => {
    const repository = createRepository();
    vi.mocked(repository.getAll).mockResolvedValue([expertCase]);
    vi.mocked(repository.create).mockRejectedValue(new Error('offline'));

    render(<CasesHarness repository={repository} />);
    await screen.findByText(expertCase.title);
    fireEvent.click(screen.getByRole('button', { name: 'Создать' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Не удалось сохранить кейс');
    expect(screen.getByText(expertCase.title)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Повторить' })).not.toBeInTheDocument();
  });
});
