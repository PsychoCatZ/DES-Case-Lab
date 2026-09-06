import type { ExpertCase } from '../../domain/case';
import { Button } from '../ui/Button';
import { CaseStatusBadge } from './CaseStatusBadge';

interface CaseTableProps {
  cases: ExpertCase[];
  onEdit: (item: ExpertCase) => void;
  onDelete: (item: ExpertCase) => void;
}

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

export function CaseTable({ cases, onEdit, onDelete }: CaseTableProps) {
  return (
    <div className="case-table-wrap">
      <table className="case-table">
        <thead>
          <tr>
            <th>Кейс</th><th>Модуль</th><th>Модель</th><th>Ответ модели</th>
            <th>Статус</th><th>Создан</th><th><span className="sr-only">Действия</span></th>
          </tr>
        </thead>
        <tbody>
          {cases.map((item) => (
            <tr key={item.id}>
              <td className="case-table__title">{item.title}</td>
              <td><span className="tag">{item.module}</span></td>
              <td>{item.model}</td>
              <td className="case-table__response" title={item.response}>{item.response}</td>
              <td><CaseStatusBadge status={item.status} /></td>
              <td className="case-table__date">{dateFormatter.format(new Date(item.createdAt))}</td>
              <td>
                <div className="row-actions">
                  <Button variant="ghost" onClick={() => onEdit(item)} aria-label={`Редактировать ${item.title}`}>Изменить</Button>
                  <Button variant="ghost" onClick={() => onDelete(item)} aria-label={`Удалить ${item.title}`}>Удалить</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
