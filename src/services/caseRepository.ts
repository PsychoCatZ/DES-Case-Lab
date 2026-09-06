import type { CaseInput, ExpertCase } from '../domain/case';

export interface CaseRepository {
  getAll(): Promise<ExpertCase[]>;
  create(input: CaseInput): Promise<ExpertCase>;
  update(id: string, input: CaseInput): Promise<ExpertCase>;
  remove(id: string): Promise<void>;
}
