import type { ExpertCase } from '../../domain/case';
import { Button } from '../ui/Button';
import { CaseStatusBadge } from './CaseStatusBadge';

interface CaseCardListProps {
  cases: ExpertCase[];
  onEdit: (item: ExpertCase) => void;
  onDelete: (item: ExpertCase) => void;
}

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

export function CaseCardList({ cases, onEdit, onDelete }: CaseCardListProps) {
  return (
    <div className="case-cards">
      {cases.map((item) => (
        <article className="case-card" key={item.id}>
          <div className="case-card__top">
            <span className="tag">{item.module}</span>
            <CaseStatusBadge status={item.status} />
          </div>
          <h3>{item.title}</h3>
          <p className="case-card__response">{item.response}</p>
          <div className="case-card__meta">
            <span>{item.model}</span>
            <span>{dateFormatter.format(new Date(item.createdAt))}</span>
          </div>
          <div className="case-card__actions">
            <Button variant="secondary" onClick={() => onEdit(item)}>Изменить</Button>
            <Button variant="ghost" onClick={() => onDelete(item)}>Удалить</Button>
          </div>
        </article>
      ))}
    </div>
  );
}
