import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ExpertCase } from '../../../domain/case';
import { createCase, getAllCases } from '../../../../api/_lib/caseQueries';
import { GET, POST } from '../../../../api/cases/index';

vi.mock('../../../../api/_lib/caseQueries', () => ({
  createCase: vi.fn(),
  getAllCases: vi.fn(),
}));

const testCase: ExpertCase = {
  id: '00000000-0000-4000-8000-000000000001',
  title: 'Тестовый кейс',
  module: 'Genre',
  model: 'Sol',
  response: 'Ответ модели',
  status: 'accepted',
  createdAt: '2026-09-07T10:00:00.000Z',
  updatedAt: '2026-09-07T10:00:00.000Z',
};

describe('/api/cases', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns all cases', async () => {
    vi.mocked(getAllCases).mockResolvedValue([testCase]);

    const response = await GET();

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual([testCase]);
    expect(body[0]).toHaveProperty('createdAt');
    expect(body[0]).toHaveProperty('updatedAt');
    expect(body[0]).not.toHaveProperty('created_at');
    expect(body[0]).not.toHaveProperty('updated_at');
  });

  it('creates a valid case', async () => {
    vi.mocked(createCase).mockResolvedValue(testCase);
    const input = {
      title: testCase.title,
      module: testCase.module,
      model: testCase.model,
      response: testCase.response,
      status: testCase.status,
    };

    const response = await POST(new Request('http://localhost/api/cases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }));

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual(testCase);
    expect(createCase).toHaveBeenCalledWith(input);
  });

  it('rejects an invalid case without querying the database', async () => {
    const response = await POST(new Request('http://localhost/api/cases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '' }),
    }));

    expect(response.status).toBe(400);
    expect(createCase).not.toHaveBeenCalled();
  });

});
