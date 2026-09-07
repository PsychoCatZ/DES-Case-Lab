import { describe, expect, it } from 'vitest';
import { resolveDataSourceConfig } from './dataSource';

describe('resolveDataSourceConfig', () => {
  it('uses API defaults', () => {
    expect(resolveDataSourceConfig(undefined, undefined)).toEqual({
      source: 'api',
      apiBaseUrl: '/api',
    });
  });

  it('selects the local repository explicitly', () => {
    expect(resolveDataSourceConfig('local', '/custom-api')).toEqual({
      source: 'local',
      apiBaseUrl: '/custom-api',
    });
  });

  it('rejects a mistyped data source', () => {
    expect(() => resolveDataSourceConfig('offline', '/api')).toThrow(
      'VITE_DATA_SOURCE должен иметь значение api или local.',
    );
  });
});
