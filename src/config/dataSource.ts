export type DataSource = 'api' | 'local';

export interface DataSourceConfig {
  source: DataSource;
  apiBaseUrl: string;
}

export function resolveDataSourceConfig(
  sourceValue: string | undefined,
  apiBaseUrlValue: string | undefined,
): DataSourceConfig {
  const source = sourceValue?.trim() || 'api';
  if (source !== 'api' && source !== 'local') {
    throw new Error('VITE_DATA_SOURCE должен иметь значение api или local.');
  }

  const apiBaseUrl = apiBaseUrlValue?.trim() || '/api';
  return { source, apiBaseUrl };
}

export function getDataSourceConfig(): DataSourceConfig {
  return resolveDataSourceConfig(
    import.meta.env.VITE_DATA_SOURCE,
    import.meta.env.VITE_API_BASE_URL,
  );
}
