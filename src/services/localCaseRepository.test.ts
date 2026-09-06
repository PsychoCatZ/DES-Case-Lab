import { DEMO_CASES } from '../data/demoCases';
import {
  CASES_STORAGE_KEY,
  LocalCaseRepository,
  RECOVERY_KEY_PREFIX,
  type RecoveryNotice,
} from './localCaseRepository';

describe('LocalCaseRepository', () => {
  beforeEach(() => localStorage.clear());

  it('записывает демо-кейсы только при первом запуске', async () => {
    const repository = new LocalCaseRepository(localStorage);
    expect(await repository.getAll()).toHaveLength(DEMO_CASES.length);
    expect(JSON.parse(localStorage.getItem(CASES_STORAGE_KEY) ?? '[]')).toHaveLength(DEMO_CASES.length);
  });

  it('сохраняет намеренно пустой журнал', async () => {
    localStorage.setItem(CASES_STORAGE_KEY, '[]');
    expect(await new LocalCaseRepository(localStorage).getAll()).toEqual([]);
  });

  it('создаёт, обновляет и удаляет кейс', async () => {
    localStorage.setItem(CASES_STORAGE_KEY, '[]');
    const repository = new LocalCaseRepository(localStorage);
    const created = await repository.create({
      title: 'Тест', module: 'Text', model: 'Sol', response: 'Ответ', status: 'review',
    });
    const updated = await repository.update(created.id, {
      title: 'Исправленный тест', module: 'Text', model: 'Sol', response: 'Ответ', status: 'accepted',
    });
    expect(updated.createdAt).toBe(created.createdAt);
    expect(updated.title).toBe('Исправленный тест');
    await repository.remove(created.id);
    expect(await repository.getAll()).toEqual([]);
  });

  it('создаёт backup до замены повреждённых данных', async () => {
    const brokenValue = '{not-json';
    const notices: RecoveryNotice[] = [];
    localStorage.setItem(CASES_STORAGE_KEY, brokenValue);
    const repository = new LocalCaseRepository(localStorage, (notice) => notices.push(notice));

    expect(await repository.getAll()).toHaveLength(DEMO_CASES.length);
    const recoveryKey = Object.keys(localStorage).find((key) => key.startsWith(RECOVERY_KEY_PREFIX));
    expect(recoveryKey).toBeDefined();
    expect(localStorage.getItem(recoveryKey!)).toBe(brokenValue);
    expect(notices[0]?.level).toBe('info');
  });

  it('не перезаписывает исходные данные, если backup не создан', async () => {
    const brokenValue = '{not-json';
    const notices: RecoveryNotice[] = [];
    const storage = {
      getItem: (key: string) => key === CASES_STORAGE_KEY ? brokenValue : null,
      setItem: () => { throw new Error('quota'); },
      removeItem: () => undefined,
      clear: () => undefined,
      key: () => null,
      length: 1,
    } satisfies Storage;
    const repository = new LocalCaseRepository(storage, (notice) => notices.push(notice));

    expect(await repository.getAll()).toHaveLength(DEMO_CASES.length);
    expect(storage.getItem(CASES_STORAGE_KEY)).toBe(brokenValue);
    expect(notices[0]?.level).toBe('warning');
    await expect(repository.create({
      title: 'Новый', module: 'Text', model: 'Sol', response: 'Ответ', status: 'review',
    })).rejects.toThrow();
  });
});
