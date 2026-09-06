import {
  CASE_MODELS,
  CASE_MODULES,
  CASE_STATUSES,
  STATUS_LABELS,
  type CaseFiltersState,
} from '../../domain/case';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';

interface CaseFiltersProps {
  filters: CaseFiltersState;
  onChange: (filters: CaseFiltersState) => void;
  onReset: () => void;
  active: boolean;
}

export function CaseFilters({ filters, onChange, onReset, active }: CaseFiltersProps) {
  return (
    <div className="filters" aria-label="Фильтры кейсов">
      <Select
        id="filter-model"
        label="Модель"
        value={filters.model}
        onChange={(event) => onChange({ ...filters, model: event.target.value as CaseFiltersState['model'] })}
        options={[
          { value: '', label: 'Все модели' },
          ...CASE_MODELS.map((model) => ({ value: model, label: model })),
        ]}
      />
      <Select
        id="filter-module"
        label="Модуль"
        value={filters.module}
        onChange={(event) => onChange({ ...filters, module: event.target.value as CaseFiltersState['module'] })}
        options={[
          { value: '', label: 'Все модули' },
          ...CASE_MODULES.map((module) => ({ value: module, label: module })),
        ]}
      />
      <Select
        id="filter-status"
        label="Статус"
        value={filters.status}
        onChange={(event) => onChange({ ...filters, status: event.target.value as CaseFiltersState['status'] })}
        options={[
          { value: '', label: 'Все статусы' },
          ...CASE_STATUSES.map((status) => ({ value: status, label: STATUS_LABELS[status] })),
        ]}
      />
      <Button className="filters__reset" variant="ghost" onClick={onReset} disabled={!active}>
        Сбросить
      </Button>
    </div>
  );
}
