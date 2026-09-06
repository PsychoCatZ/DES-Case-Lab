interface KpiCardProps {
  label: string;
  value: number;
  tone: 'blue' | 'green' | 'red' | 'amber';
}

export function KpiCard({ label, value, tone }: KpiCardProps) {
  return (
    <article className={`kpi-card kpi-card--${tone}`}>
      <div className="kpi-card__top">
        <span className="kpi-card__signal" aria-hidden="true" />
        <span>{label}</span>
      </div>
      <strong>{value}</strong>
    </article>
  );
}
