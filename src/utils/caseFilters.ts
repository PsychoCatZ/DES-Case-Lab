import type { CaseFiltersState, ExpertCase } from '../domain/case';

export function filterCases(cases: ExpertCase[], filters: CaseFiltersState): ExpertCase[] {
  return cases.filter(
    (item) =>
      (!filters.model || item.model === filters.model) &&
      (!filters.module || item.module === filters.module) &&
      (!filters.status || item.status === filters.status),
  );
}

export function sortCasesByCreatedAt(cases: ExpertCase[]): ExpertCase[] {
  return [...cases].sort((left, right) => {
    const dateDifference = Date.parse(right.createdAt) - Date.parse(left.createdAt);
    return dateDifference || right.id.localeCompare(left.id);
  });
}

export function hasActiveFilters(filters: CaseFiltersState): boolean {
  return Boolean(filters.model || filters.module || filters.status);
}
