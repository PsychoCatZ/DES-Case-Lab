import type { CaseStats } from '../../utils/caseStats';
import { KpiCard } from './KpiCard';

export function KpiGrid({ stats }: { stats: CaseStats }) {
  return (
    <section className="kpi-grid" aria-label="Сводные показатели">
      <KpiCard label="Всего кейсов" value={stats.total} tone="blue" />
      <KpiCard label="Принято" value={stats.accepted} tone="green" />
      <KpiCard label="Ошибок" value={stats.error} tone="red" />
      <KpiCard label="На проверке" value={stats.review} tone="amber" />
    </section>
  );
}
