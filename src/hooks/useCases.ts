import { useCallback, useEffect, useState } from 'react';
import type { CaseInput, ExpertCase } from '../domain/case';
import type { CaseRepository } from '../services/caseRepository';
import { sortCasesByCreatedAt } from '../utils/caseFilters';

export function useCases(repository: CaseRepository) {
  const [cases, setCases] = useState<ExpertCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      setCases(sortCasesByCreatedAt(await repository.getAll()));
      setError(null);
    } catch {
      setError('Не удалось загрузить локальные данные.');
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
      return true;
    } catch {
      setError('Не удалось сохранить кейс. Исходные данные не изменены.');
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
      return true;
    } catch {
      setError('Не удалось обновить кейс.');
      return false;
    }
  };

  const removeCase = async (id: string): Promise<boolean> => {
    try {
      await repository.remove(id);
      setCases((current) => current.filter((item) => item.id !== id));
      setError(null);
      return true;
    } catch {
      setError('Не удалось удалить кейс.');
      return false;
    }
  };

  return {
    cases,
    isLoading,
    error,
    dismissError: () => setError(null),
    createCase,
    updateCase,
    removeCase,
  };
}
