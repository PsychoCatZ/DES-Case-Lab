import { CASE_MODELS } from '../../domain/case';
import type { CaseStats } from '../../utils/caseStats';

export function ModelStatsChart({ stats }: { stats: CaseStats }) {
  return (
    <section className="panel chart-panel" aria-labelledby="model-stats-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">РАСПРЕДЕЛЕНИЕ</p>
          <h2 id="model-stats-title">Кейсы по моделям</h2>
        </div>
        <span className="section-heading__note">Все записи</span>
      </div>
      <div className="model-chart">
        {CASE_MODELS.map((model) => {
          const count = stats.byModel[model];
          const percent = stats.total ? Math.round((count / stats.total) * 100) : 0;
          return (
            <div className="model-bar" key={model}>
              <div className="model-bar__label">
                <span>{model}</span>
                <span>{count} <small>· {percent}%</small></span>
              </div>
              <div
                className="model-bar__track"
                role="meter"
                aria-label={`${model}: ${count} кейсов, ${percent}%`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percent}
              >
                <span style={{ width: `${percent}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
