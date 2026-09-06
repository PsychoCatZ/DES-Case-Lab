import { STATUS_LABELS, type CaseStatus } from '../../domain/case';

export function CaseStatusBadge({ status }: { status: CaseStatus }) {
  return (
    <span className={`status-badge status-badge--${status}`}>
      <span aria-hidden="true" />
      {STATUS_LABELS[status]}
    </span>
  );
}
