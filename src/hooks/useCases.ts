import { useCallback, useEffect, useState } from 'react';
import type { CaseInput, ExpertCase } from '../domain/case';
import type { CaseRepository } from '../services/caseRepository';
import { sortCasesByCreatedAt } from '../utils/caseFilters';

export function useCases(repository: CaseRepository) {
  const [cases, setCases] = useState<ExpertCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canRetry, setCanRetry] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setCanRetry(false);
    try {
      setCases(sortCasesByCreatedAt(await repository.getAll()));
    } catch {
      setError('Не удалось загрузить данные. Проверьте соединение и повторите запрос.');
      setCanRetry(true);
    } finally {
      setIsLoading(false);
    }
  }, [repository]);

  useEffect(() => {
    void load();
  }, [load]);

  const createCase = async (input: CaseInput): Promise<boolean> => {
    try {
      const createdCase = await repository.create(input);
      setCases((current) => sortCasesByCreatedAt([createdCase, ...current]));
      setError(null);
      setCanRetry(false);
      return true;
    } catch {
      setError('Не удалось сохранить кейс. Исходные данные не изменены.');
      setCanRetry(false);
      return false;
    }
  };

  const updateCase = async (id: string, input: CaseInput): Promise<boolean> => {
    try {
      const updatedCase = await repository.update(id, input);
      setCases((current) =>
        sortCasesByCreatedAt(current.map((item) => (item.id === id ? updatedCase : item))),
      );
      setError(null);
      setCanRetry(false);
      return true;
    } catch {
      setError('Не удалось обновить кейс.');
      setCanRetry(false);
      return false;
    }
  };

  const removeCase = async (id: string): Promise<boolean> => {
    try {
      await repository.remove(id);
      setCases((current) => current.filter((item) => item.id !== id));
      setError(null);
      setCanRetry(false);
      return true;
    } catch {
      setError('Не удалось удалить кейс.');
      setCanRetry(false);
      return false;
    }
  };

  return {
    cases,
    isLoading,
    error,
    canRetry,
    retry: load,
    dismissError: () => setError(null),
    createCase,
    updateCase,
    removeCase,
  };
}
