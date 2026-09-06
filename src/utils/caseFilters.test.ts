import type { ExpertCase } from '../domain/case';
import { filterCases, sortCasesByCreatedAt } from './caseFilters';

const cases: ExpertCase[] = [
  {
    id: 'a', title: 'Старый', module: 'Genre', model: 'Sol', response: 'Ответ',
    status: 'accepted', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'b', title: 'Новый', module: 'Scene', model: 'Astra', response: 'Ответ',
    status: 'review', createdAt: '2026-02-01T00:00:00.000Z', updatedAt: '2026-02-01T00:00:00.000Z',
  },
];

describe('caseFilters', () => {
  it('комбинирует фильтры через AND', () => {
    expect(filterCases(cases, { model: 'Astra', module: 'Scene', status: 'review' }))
      .toEqual([cases[1]]);
    expect(filterCases(cases, { model: 'Astra', module: 'Genre', status: '' }))
      .toEqual([]);
  });

  it('сортирует по createdAt, игнорируя более новый updatedAt', () => {
    expect(sortCasesByCreatedAt(cases).map((item) => item.id)).toEqual(['b', 'a']);
  });
});
