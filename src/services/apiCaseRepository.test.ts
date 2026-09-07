import { describe, expect, it, vi } from 'vitest';
import type { CaseInput, ExpertCase } from '../domain/case';
import { ApiCaseRepository } from './apiCaseRepository';

const input: CaseInput = {
  title: 'Тестовый кейс',
  module: 'Scene',
  model: 'Astra',
  response: 'Ответ модели',
  status: 'review',
};

const expertCase: ExpertCase = {
  id: '00000000-0000-4000-8000-000000000001',
  ...input,
  createdAt: '2026-09-07T10:00:00.000Z',
  updatedAt: '2026-09-07T10:00:00.000Z',
};

function createRepository() {
  const fetchMock = vi.fn<typeof fetch>();
  return {
    fetchMock,
    repository: new ApiCaseRepository('https://example.test/api/', fetchMock),
  };
}

describe('ApiCaseRepository', () => {
  it('calls a context-sensitive fetch with the global object as this', async () => {
    let successfulCalls = 0;
    const contextSensitiveFetch = function (this: unknown) {
      if (this !== globalThis) {
        return Promise.reject(new TypeError('Illegal invocation'));
      }
      successfulCalls += 1;
      return Promise.resolve(Response.json([expertCase]));
    } as typeof fetch;
    const repository = new ApiCaseRepository('https://example.test/api', contextSensitiveFetch);

    await expect(repository.getAll()).resolves.toEqual([expertCase]);
    expect(successfulCalls).toBe(1);
  });

  it('loads and validates a list of cases', async () => {
    const { fetchMock, repository } = createRepository();
    fetchMock.mockResolvedValue(Response.json([expertCase]));

    await expect(repository.getAll()).resolves.toEqual([expertCase]);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.test/api/cases',
      expect.objectContaining({ headers: { Accept: 'application/json' } }),
    );
  });

  it('sends a create request and returns the created case', async () => {
    const { fetchMock, repository } = createRepository();
    fetchMock.mockResolvedValue(Response.json(expertCase, { status: 201 }));

    await expect(repository.create(input)).resolves.toEqual(expertCase);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.test/api/cases',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(input),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }),
    );
  });

  it('sends update and delete requests for an encoded id', async () => {
    const { fetchMock, repository } = createRepository();
    fetchMock
      .mockResolvedValueOnce(Response.json(expertCase))
      .mockResolvedValueOnce(new Response(null, { status: 204 }));

    await expect(repository.update('case/id', input)).resolves.toEqual(expertCase);
    await expect(repository.remove('case/id')).resolves.toBeUndefined();

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      'https://example.test/api/cases/case%2Fid',
      expect.objectContaining({ method: 'PUT', body: JSON.stringify(input) }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      'https://example.test/api/cases/case%2Fid',
      expect.objectContaining({ method: 'DELETE' }),
    );
  });

  it('uses the safe server error message', async () => {
    const { fetchMock, repository } = createRepository();
    fetchMock.mockResolvedValue(Response.json(
      { error: { code: 'CASE_NOT_FOUND', message: 'Кейс не найден.' } },
      { status: 404 },
    ));

    await expect(repository.update(expertCase.id, input)).rejects.toThrow('Кейс не найден.');
  });

  it('reports a network failure', async () => {
    const { fetchMock, repository } = createRepository();
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));

    await expect(repository.getAll()).rejects.toThrow('Не удалось соединиться с API.');
  });

  it('rejects SQL-shaped dates instead of leaking them into the UI', async () => {
    const { fetchMock, repository } = createRepository();
    fetchMock.mockResolvedValue(Response.json([{
      ...expertCase,
      createdAt: undefined,
      updatedAt: undefined,
      created_at: expertCase.createdAt,
      updated_at: expertCase.updatedAt,
    }]));

    await expect(repository.getAll()).rejects.toThrow(
      'API вернул некорректный список кейсов.',
    );
  });
});
