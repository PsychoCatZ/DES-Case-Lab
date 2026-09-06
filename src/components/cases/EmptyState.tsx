import { Button } from '../ui/Button';

interface EmptyStateProps {
  filtered: boolean;
  onReset: () => void;
  onCreate: () => void;
}

export function EmptyState({ filtered, onReset, onCreate }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <span className="empty-state__icon" aria-hidden="true">{filtered ? '⌁' : '＋'}</span>
      <h3>{filtered ? 'Ничего не найдено' : 'Журнал пока пуст'}</h3>
      <p>
        {filtered
          ? 'Измените условия поиска или сбросьте активные фильтры.'
          : 'Добавьте первый кейс, чтобы начать собирать результаты моделей.'}
      </p>
      <Button variant="secondary" onClick={filtered ? onReset : onCreate}>
        {filtered ? 'Сбросить фильтры' : 'Добавить кейс'}
      </Button>
    </div>
  );
}
