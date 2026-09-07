import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

type SqlClient = NeonQueryFunction<false, false>;

let sqlClient: SqlClient | null = null;

export function getSqlClient(): SqlClient {
  if (sqlClient) return sqlClient;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not configured');
  }

  sqlClient = neon(connectionString);
  return sqlClient;
}
