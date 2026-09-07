import {
  CASE_MODELS,
  CASE_MODULES,
  CASE_STATUSES,
  type CaseInput,
  type CaseModel,
  type CaseModule,
  type CaseStatus,
} from '../../src/domain/case';

export type ValidationResult =
  | { ok: true; value: CaseInput }
  | { ok: false; message: string };

export function validateCaseInput(value: unknown): ValidationResult {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return invalid();
  }

  const input = value as Record<string, unknown>;
  const title = typeof input.title === 'string' ? input.title.trim() : '';
  const response = typeof input.response === 'string' ? input.response.trim() : '';

  if (!title || !response) {
    return { ok: false, message: 'Заполните название и ответ модели.' };
  }

  if (!CASE_MODULES.includes(input.module as CaseModule)) {
    return invalid('Передан неизвестный модуль.');
  }

  if (!CASE_MODELS.includes(input.model as CaseModel)) {
    return invalid('Передана неизвестная модель.');
  }

  if (!CASE_STATUSES.includes(input.status as CaseStatus)) {
    return invalid('Передан неизвестный статус.');
  }

  return {
    ok: true,
    value: {
      title,
      module: input.module as CaseModule,
      model: input.model as CaseModel,
      response,
      status: input.status as CaseStatus,
    },
  };
}

function invalid(message = 'Некорректные данные кейса.'): ValidationResult {
  return { ok: false, message };
}
