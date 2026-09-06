export const CASE_MODULES = ['Genre', 'Scene', 'Photo', 'Text'] as const;
export const CASE_MODELS = ['Sol', 'DeepSeek', 'Astra'] as const;
export const CASE_STATUSES = ['accepted', 'error', 'review'] as const;

export type CaseModule = (typeof CASE_MODULES)[number];
export type CaseModel = (typeof CASE_MODELS)[number];
export type CaseStatus = (typeof CASE_STATUSES)[number];

export interface ExpertCase {
  id: string;
  title: string;
  module: CaseModule;
  model: CaseModel;
  response: string;
  status: CaseStatus;
  createdAt: string;
  updatedAt: string;
}

export type CaseInput = Pick<ExpertCase, 'title' | 'module' | 'model' | 'response' | 'status'>;

export interface CaseFiltersState {
  model: CaseModel | '';
  module: CaseModule | '';
  status: CaseStatus | '';
}

export const EMPTY_FILTERS: CaseFiltersState = { model: '', module: '', status: '' };

export const STATUS_LABELS: Record<CaseStatus, string> = {
  accepted: 'Принят',
  error: 'Ошибка',
  review: 'На проверке',
};

export function isExpertCase(value: unknown): value is ExpertCase {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === 'string' &&
    typeof item.title === 'string' &&
    CASE_MODULES.includes(item.module as CaseModule) &&
    CASE_MODELS.includes(item.model as CaseModel) &&
    typeof item.response === 'string' &&
    CASE_STATUSES.includes(item.status as CaseStatus) &&
    typeof item.createdAt === 'string' &&
    !Number.isNaN(Date.parse(item.createdAt)) &&
    typeof item.updatedAt === 'string' &&
    !Number.isNaN(Date.parse(item.updatedAt))
  );
}
