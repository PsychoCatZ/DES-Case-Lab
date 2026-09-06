import { CASE_MODELS, type CaseModel, type ExpertCase } from '../domain/case';

export interface CaseStats {
  total: number;
  accepted: number;
  error: number;
  review: number;
  byModel: Record<CaseModel, number>;
}

export function calculateCaseStats(cases: ExpertCase[]): CaseStats {
  const byModel = Object.fromEntries(CASE_MODELS.map((model) => [model, 0])) as Record<CaseModel, number>;
  const stats: CaseStats = { total: cases.length, accepted: 0, error: 0, review: 0, byModel };
  cases.forEach((item) => {
    stats[item.status] += 1;
    stats.byModel[item.model] += 1;
  });
  return stats;
}
