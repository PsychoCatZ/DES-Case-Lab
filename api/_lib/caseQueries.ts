import { isExpertCase, type CaseInput, type ExpertCase } from '../../src/domain/case';
import { getSqlClient } from './db';

export async function getAllCases(): Promise<ExpertCase[]> {
  const sql = getSqlClient();
  const rows = await sql`
    SELECT
      id::text AS id,
      title,
      module,
      model,
      response,
      status,
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM cases
    ORDER BY created_at DESC, id DESC
  `;

  return rows.map(mapCaseRow);
}

export async function createCase(input: CaseInput): Promise<ExpertCase> {
  const sql = getSqlClient();
  const rows = await sql`
    INSERT INTO cases (title, module, model, response, status)
    VALUES (${input.title}, ${input.module}, ${input.model}, ${input.response}, ${input.status})
    RETURNING
      id::text AS id,
      title,
      module,
      model,
      response,
      status,
      created_at AS "createdAt",
      updated_at AS "updatedAt"
  `;

  return mapCaseRow(rows[0]);
}

export async function updateCase(id: string, input: CaseInput): Promise<ExpertCase | null> {
  const sql = getSqlClient();
  const rows = await sql`
    UPDATE cases
    SET
      title = ${input.title},
      module = ${input.module},
      model = ${input.model},
      response = ${input.response},
      status = ${input.status},
      updated_at = now()
    WHERE id = ${id}::uuid
    RETURNING
      id::text AS id,
      title,
      module,
      model,
      response,
      status,
      created_at AS "createdAt",
      updated_at AS "updatedAt"
  `;

  return rows[0] ? mapCaseRow(rows[0]) : null;
}

export async function removeCase(id: string): Promise<boolean> {
  const sql = getSqlClient();
  const rows = await sql`
    DELETE FROM cases
    WHERE id = ${id}::uuid
    RETURNING id
  `;

  return rows.length > 0;
}

export function mapCaseRow(row: unknown): ExpertCase {
  if (!row || typeof row !== 'object') {
    throw new Error('Database returned an invalid case');
  }

  const value = row as Record<string, unknown>;
  const candidate = {
    id: value.id,
    title: value.title,
    module: value.module,
    model: value.model,
    response: value.response,
    status: value.status,
    createdAt: toIsoString(value.createdAt),
    updatedAt: toIsoString(value.updatedAt),
  };

  if (!isExpertCase(candidate)) {
    throw new Error('Database returned an invalid case');
  }

  return candidate;
}

function toIsoString(value: unknown): unknown {
  if (value instanceof Date) return value.toISOString();
  if (typeof value !== 'string') return value;

  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? value : new Date(timestamp).toISOString();
}
