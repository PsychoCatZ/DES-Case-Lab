import { describe, expect, it } from 'vitest';
import { mapCaseRow } from '../../../../api/_lib/caseQueries';

describe('mapCaseRow', () => {
  it('returns the frontend ExpertCase shape without SQL field names', () => {
    const result = mapCaseRow({
      id: '00000000-0000-4000-8000-000000000001',
      title: 'Кейс',
      module: 'Photo',
      model: 'DeepSeek',
      response: 'Ответ',
      status: 'review',
      createdAt: new Date('2026-09-07T10:00:00.000Z'),
      updatedAt: '2026-09-07 11:00:00+00',
      created_at: 'must-not-leak',
      updated_at: 'must-not-leak',
    });

    expect(result).toEqual({
      id: '00000000-0000-4000-8000-000000000001',
      title: 'Кейс',
      module: 'Photo',
      model: 'DeepSeek',
      response: 'Ответ',
      status: 'review',
      createdAt: '2026-09-07T10:00:00.000Z',
      updatedAt: '2026-09-07T11:00:00.000Z',
    });
    expect(result).not.toHaveProperty('created_at');
    expect(result).not.toHaveProperty('updated_at');
  });
});
