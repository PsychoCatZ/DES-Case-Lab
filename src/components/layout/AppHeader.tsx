import { Button } from '../ui/Button';

export function AppHeader({ onCreate }: { onCreate: () => void }) {
  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand__mark" aria-hidden="true">D</span>
        <div>
          <div className="brand__name">DES CASE LAB</div>
          <p className="brand__meta">Локальный журнал экспертных кейсов</p>
        </div>
      </div>
      <Button variant="primary" onClick={onCreate}>
        <span aria-hidden="true">＋</span> Добавить кейс
      </Button>
    </header>
  );
}
