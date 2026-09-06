import { useEffect, useState, type FormEvent } from 'react';
import {
  CASE_MODELS,
  CASE_MODULES,
  CASE_STATUSES,
  STATUS_LABELS,
  type CaseInput,
  type ExpertCase,
} from '../../domain/case';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';

interface CaseFormProps {
  open: boolean;
  item: ExpertCase | null;
  onClose: () => void;
  onSubmit: (input: CaseInput) => Promise<boolean>;
}

const EMPTY_FORM: CaseInput = {
  title: '',
  module: 'Genre',
  model: 'Sol',
  response: '',
  status: 'review',
};

export function CaseForm({ open, item, onClose, onSubmit }: CaseFormProps) {
  const [form, setForm] = useState<CaseInput>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [validationError, setValidationError] = useState('');
  const formId = 'case-editor-form';

  useEffect(() => {
    if (!open) return;
    setForm(item
      ? {
          title: item.title,
          module: item.module,
          model: item.model,
          response: item.response,
          status: item.status,
        }
      : EMPTY_FORM,
    );
    setValidationError('');
  }, [item, open]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const cleanForm = { ...form, title: form.title.trim(), response: form.response.trim() };
    if (!cleanForm.title || !cleanForm.response) {
      setValidationError('Заполните название и ответ модели.');
      return;
    }
    setIsSaving(true);
    const saved = await onSubmit(cleanForm);
    setIsSaving(false);
    if (saved) onClose();
  };

  return (
    <Modal
      open={open}
      title={item ? 'Редактировать кейс' : 'Новый кейс'}
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSaving}>Отмена</Button>
          <Button type="submit" form={formId} variant="primary" disabled={isSaving}>
            {isSaving ? 'Сохранение…' : item ? 'Сохранить' : 'Добавить кейс'}
          </Button>
        </>
      }
    >
      <form id={formId} className="case-form" onSubmit={handleSubmit}>
        <label className="field field--wide" htmlFor="case-title">
          <span className="field__label">Название или краткое описание</span>
          <input
            id="case-title"
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            placeholder="Например, проверить композицию сцены"
            autoFocus
            required
          />
        </label>
        <div className="case-form__grid">
          <Select
            id="case-module"
            label="Модуль"
            value={form.module}
            onChange={(event) => setForm({ ...form, module: event.target.value as CaseInput['module'] })}
            options={CASE_MODULES.map((module) => ({ value: module, label: module }))}
          />
          <Select
            id="case-model"
            label="Модель"
            value={form.model}
            onChange={(event) => setForm({ ...form, model: event.target.value as CaseInput['model'] })}
            options={CASE_MODELS.map((model) => ({ value: model, label: model }))}
          />
          <Select
            id="case-status"
            label="Статус"
            value={form.status}
            onChange={(event) => setForm({ ...form, status: event.target.value as CaseInput['status'] })}
            options={CASE_STATUSES.map((status) => ({ value: status, label: STATUS_LABELS[status] }))}
          />
        </div>
        <label className="field field--wide" htmlFor="case-response">
          <span className="field__label">Ответ модели</span>
          <textarea
            id="case-response"
            rows={7}
            value={form.response}
            onChange={(event) => setForm({ ...form, response: event.target.value })}
            placeholder="Вставьте ответ модели…"
            required
          />
        </label>
        {validationError && <p className="form-error" role="alert">{validationError}</p>}
      </form>
    </Modal>
  );
}
