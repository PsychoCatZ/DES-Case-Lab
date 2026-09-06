import { DEMO_CASES } from '../data/demoCases';
import { calculateCaseStats } from './caseStats';

describe('calculateCaseStats', () => {
  it('считает KPI и распределение по моделям', () => {
    expect(calculateCaseStats(DEMO_CASES)).toEqual({
      total: 6,
      accepted: 3,
      error: 1,
      review: 2,
      byModel: { Sol: 2, DeepSeek: 2, Astra: 2 },
    });
  });

  it('возвращает нули для пустого журнала', () => {
    const stats = calculateCaseStats([]);
    expect(stats.total).toBe(0);
    expect(stats.byModel).toEqual({ Sol: 0, DeepSeek: 0, Astra: 0 });
  });
});
