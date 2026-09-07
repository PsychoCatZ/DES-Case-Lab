import { describe, expect, it } from 'vitest';
import { validateCaseInput } from '../../../../api/_lib/validation';

describe('validateCaseInput', () => {
  it('accepts and trims a complete case input', () => {
    expect(validateCaseInput({
      title: '  Тестовый кейс  ',
      module: 'Scene',
      model: 'Astra',
      response: '  Ответ модели  ',
      status: 'review',
    })).toEqual({
      ok: true,
      value: {
        title: 'Тестовый кейс',
        module: 'Scene',
        model: 'Astra',
        response: 'Ответ модели',
        status: 'review',
      },
    });
  });

  it('rejects empty required fields', () => {
    expect(validateCaseInput({
      title: ' ',
      module: 'Genre',
      model: 'Sol',
      response: 'Ответ',
      status: 'accepted',
    })).toEqual({
      ok: false,
      message: 'Заполните название и ответ модели.',
    });
  });

  it.each([
    ['module', 'Unknown', 'Передан неизвестный модуль.'],
    ['model', 'Unknown', 'Передана неизвестная модель.'],
    ['status', 'Unknown', 'Передан неизвестный статус.'],
  ])('rejects an unknown %s value', (field, value, message) => {
    expect(validateCaseInput({
      title: 'Кейс',
      module: 'Genre',
      model: 'Sol',
      response: 'Ответ',
      status: 'accepted',
      [field]: value,
    })).toEqual({ ok: false, message });
  });
});
