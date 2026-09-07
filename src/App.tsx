import { useMemo, useState } from 'react';
import { CaseCardList } from './components/cases/CaseCardList';
import { CaseFilters } from './components/cases/CaseFilters';
import { CaseForm } from './components/cases/CaseForm';
import { CaseTable } from './components/cases/CaseTable';
import { DeleteCaseDialog } from './components/cases/DeleteCaseDialog';
import { EmptyState } from './components/cases/EmptyState';
import { KpiGrid } from './components/dashboard/KpiGrid';
import { ModelStatsChart } from './components/dashboard/ModelStatsChart';
import { AppHeader } from './components/layout/AppHeader';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Button } from './components/ui/Button';
import { getDataSourceConfig } from './config/dataSource';
import {
  EMPTY_FILTERS,
  type CaseFiltersState,
  type CaseInput,
  type ExpertCase,
} from './domain/case';
import { useCases } from './hooks/useCases';
import { ApiCaseRepository } from './services/apiCaseRepository';
import type { CaseRepository } from './services/caseRepository';
import { LocalCaseRepository, type RecoveryNotice } from './services/localCaseRepository';
import { filterCases, hasActiveFilters } from './utils/caseFilters';
import { calculateCaseStats } from './utils/caseStats';

const dataSourceConfig = getDataSourceConfig();

export default function App() {
  const [recoveryNotice, setRecoveryNotice] = useState<RecoveryNotice | null>(null);
  const repository = useMemo<CaseRepository>(
    () => dataSourceConfig.source === 'local'
      ? new LocalCaseRepository(window.localStorage, setRecoveryNotice)
      : new ApiCaseRepository(dataSourceConfig.apiBaseUrl),
    [],
  );
  const {
    cases,
    isLoading,
    error,
    canRetry,
    retry,
    dismissError,
    createCase,
    updateCase,
    removeCase,
  } = useCases(repository);
  const [filters, setFilters] = useState<CaseFiltersState>(EMPTY_FILTERS);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<ExpertCase | null>(null);
  const [deletingCase, setDeletingCase] = useState<ExpertCase | null>(null);

  const stats = useMemo(() => calculateCaseStats(cases), [cases]);
  const visibleCases = useMemo(() => filterCases(cases, filters), [cases, filters]);
  const filtersActive = hasActiveFilters(filters);

  const openCreateForm = () => {
    setEditingCase(null);
    setFormOpen(true);
  };

  const openEditForm = (item: ExpertCase) => {
    setEditingCase(item);
    setFormOpen(true);
  };

  const saveCase = (input: CaseInput) =>
    editingCase ? updateCase(editingCase.id, input) : createCase(input);

  return (
    <DashboardLayout>
      <AppHeader onCreate={openCreateForm} />

      {(recoveryNotice || error) && (
        <div
          className={`notice notice--${recoveryNotice?.level ?? 'warning'}`}
          role={error ? 'alert' : 'status'}
        >
          <span>{error ?? recoveryNotice?.message}</span>
          <div className="notice__actions">
            {error && canRetry && (
              <Button variant="secondary" onClick={() => void retry()}>
                Повторить
              </Button>
            )}
            <Button
              variant="ghost"
              aria-label="Закрыть уведомление"
              onClick={() => {
                dismissError();
                setRecoveryNotice(null);
              }}
            >
              ×
            </Button>
          </div>
        </div>
      )}

      <main>
        <KpiGrid stats={stats} />

        <div className="dashboard-grid">
          <ModelStatsChart stats={stats} />
        </div>

        <section className="panel journal" aria-labelledby="journal-title">
          <div className="section-heading journal__heading">
            <div>
              <p className="eyebrow">ЖУРНАЛ</p>
              <h2 id="journal-title">Экспертные кейсы</h2>
            </div>
            <span className="section-heading__note">
              Показано {visibleCases.length} из {cases.length}
            </span>
          </div>

          <CaseFilters
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters(EMPTY_FILTERS)}
            active={filtersActive}
          />

          {isLoading ? (
            <div className="loading-state" role="status">Загрузка журнала…</div>
          ) : visibleCases.length ? (
            <>
              <CaseTable cases={visibleCases} onEdit={openEditForm} onDelete={setDeletingCase} />
              <CaseCardList cases={visibleCases} onEdit={openEditForm} onDelete={setDeletingCase} />
            </>
          ) : (
            <EmptyState
              filtered={filtersActive}
              onReset={() => setFilters(EMPTY_FILTERS)}
              onCreate={openCreateForm}
            />
          )}
        </section>
      </main>

      <CaseForm
        open={formOpen}
        item={editingCase}
        onClose={() => setFormOpen(false)}
        onSubmit={saveCase}
      />
      <DeleteCaseDialog
        item={deletingCase}
        onClose={() => setDeletingCase(null)}
        onConfirm={() => (deletingCase ? removeCase(deletingCase.id) : Promise.resolve(false))}
      />
    </DashboardLayout>
  );
}
