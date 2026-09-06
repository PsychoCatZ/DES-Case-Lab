import { DEMO_CASES } from '../data/demoCases';
import { isExpertCase, type CaseInput, type ExpertCase } from '../domain/case';
import type { CaseRepository } from './caseRepository';

export const CASES_STORAGE_KEY = 'des-case-lab:cases';
export const RECOVERY_KEY_PREFIX = 'des-case-lab:cases:recovery:';

export type RecoveryNotice = {
  message: string;
  level: 'info' | 'warning';
};

type RecoveryListener = (notice: RecoveryNotice) => void;

export class LocalCaseRepository implements CaseRepository {
  private writeBlocked = false;

  constructor(
    private readonly storage: Storage,
    private readonly onRecovery?: RecoveryListener,
  ) {}

  async getAll(): Promise<ExpertCase[]> {
    const raw = this.storage.getItem(CASES_STORAGE_KEY);
    if (raw === null) {
      const cases = this.cloneDemoCases();
      this.persist(cases);
      return cases;
    }

    try {
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed) || !parsed.every(isExpertCase)) {
        throw new Error('Некорректная структура данных');
      }
      this.writeBlocked = false;
      return parsed;
    } catch {
      return this.recover(raw);
    }
  }

  async create(input: CaseInput): Promise<ExpertCase> {
    const cases = await this.getAll();
    const now = new Date().toISOString();
    const createdCase: ExpertCase = {
      ...input,
      id: globalThis.crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    this.persist([createdCase, ...cases]);
    return createdCase;
  }

  async update(id: string, input: CaseInput): Promise<ExpertCase> {
    const cases = await this.getAll();
    const current = cases.find((item) => item.id === id);
    if (!current) throw new Error('Кейс не найден');
    const updatedCase: ExpertCase = {
      ...current,
      ...input,
      updatedAt: new Date().toISOString(),
    };
    this.persist(cases.map((item) => (item.id === id ? updatedCase : item)));
    return updatedCase;
  }

  async remove(id: string): Promise<void> {
    const cases = await this.getAll();
    if (!cases.some((item) => item.id === id)) throw new Error('Кейс не найден');
    this.persist(cases.filter((item) => item.id !== id));
  }

  private recover(raw: string): ExpertCase[] {
    const cases = this.cloneDemoCases();
    try {
      this.storage.setItem(`${RECOVERY_KEY_PREFIX}${Date.now()}`, raw);
    } catch {
      this.writeBlocked = true;
      this.onRecovery?.({
        level: 'warning',
        message: 'Локальные данные не удалось прочитать и сохранить в резервную копию. Демо-кейсы загружены без перезаписи исходных данных.',
      });
      return cases;
    }

    try {
      this.storage.setItem(CASES_STORAGE_KEY, JSON.stringify(cases));
      this.writeBlocked = false;
      this.onRecovery?.({
        level: 'info',
        message: 'Локальные данные не удалось прочитать. Создана резервная копия, загружены демонстрационные кейсы.',
      });
    } catch {
      this.writeBlocked = true;
      this.onRecovery?.({
        level: 'warning',
        message: 'Резервная копия создана, но восстановленные данные не удалось сохранить. Демо-кейсы доступны только в текущей сессии.',
      });
    }
    return cases;
  }

  private persist(cases: ExpertCase[]): void {
    if (this.writeBlocked) {
      throw new Error('Сохранение заблокировано, чтобы не перезаписать исходные данные');
    }
    this.storage.setItem(CASES_STORAGE_KEY, JSON.stringify(cases));
  }

  private cloneDemoCases(): ExpertCase[] {
    return DEMO_CASES.map((item) => ({ ...item }));
  }
}
