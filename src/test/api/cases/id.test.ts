import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CaseInput, ExpertCase } from '../../../domain/case';
import { removeCase, updateCase } from '../../../../api/_lib/caseQueries';
import { DELETE, PUT } from '../../../../api/cases/[id]';

vi.mock('../../../../api/_lib/caseQueries', () => ({
  removeCase: vi.fn(),
  updateCase: vi.fn(),
}));

const id = '00000000-0000-4000-8000-000000000001';
const input: CaseInput = {
  title: 'Обновлённый кейс',
  module: 'Text',
  model: 'Astra',
  response: 'Обновлённый ответ',
  status: 'review',
};
const updatedCase: ExpertCase = {
  id,
  ...input,
  createdAt: '2026-09-07T10:00:00.000Z',
  updatedAt: '2026-09-07T11:00:00.000Z',
};

describe('/api/cases/:id', () => {
  beforeEach(() => vi.clearAllMocks());

  it('updates an existing case', async () => {
    vi.mocked(updateCase).mockResolvedValue(updatedCase);

    const response = await PUT(new Request(`http://localhost/api/cases/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(updatedCase);
    expect(updateCase).toHaveBeenCalledWith(id, input);
  });

  it('returns 404 when a case does not exist', async () => {
    vi.mocked(updateCase).mockResolvedValue(null);

    const response = await PUT(new Request(`http://localhost/api/cases/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }));

    expect(response.status).toBe(404);
  });

  it('deletes an existing case', async () => {
    vi.mocked(removeCase).mockResolvedValue(true);

    const response = await DELETE(new Request(`http://localhost/api/cases/${id}`, {
      method: 'DELETE',
    }));

    expect(response.status).toBe(204);
    expect(removeCase).toHaveBeenCalledWith(id);
  });

  it('rejects an invalid identifier without querying the database', async () => {
    const response = await DELETE(new Request('http://localhost/api/cases/not-a-uuid', {
      method: 'DELETE',
    }));

    expect(response.status).toBe(400);
    expect(removeCase).not.toHaveBeenCalled();
  });
});
