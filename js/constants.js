'use strict';

/*
***********************************************************************************
***********************************************************************************
***
***                     КОНСТАНТЫ, ГЛОБАЛЬНЫЕ ОБЪЕКТЫ, МАССИВЫ
***
***********************************************************************************
***********************************************************************************
*/

window.constants = {

  // Коды клавиш
  ESC_KEYCODE: 27,

  // Смещение всех пинов (кроме управляющего) по X и Y с учетом брака стилизации
  PIN_SHIFT_X: 5,
  PIN_SHIFT_Y: 37,

  // Карта пинов и объявлений
  MAP: document.querySelector('.map'),

  // Контейнер пинов
  PINS_CONTAINER: document.querySelector('.map__pins'),

  // Управляющий пользовательский пин
  CONTROL_PIN: document.querySelector('.map__pin--main'),

  // Форма создания объявлений
  USER_FORM: document.querySelector('.notice__form'),

  // Массив — Заголовки объявлений
  OFFERS_TITLES: [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ],

  // Объект — Типы жилья (ключи и расшифровки)
  OFFERS_PROPERTY_TYPES: {
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  },

  // Массив — Время checkin и checkout
  OFFERS_TIMES: [
    '12:00',
    '13:00',
    '14:00'
  ],

  // Массив — Преимущества жилья
  OFFERS_FEATURES: [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ],

  // Библиотека ошибок валидации формы
  INPUT_ERRORS: {
    valueMissing: 'Это поле не должно быть пустым.',
    valueShort: 'Минимально допустимая длина: 30 символов. Сейчас: ',
    valueLong: 'Максимально допустимая длина: 100 символов. Сейчас: ',
    rangeUnderflow: 'Минимально допустимое значение: ',
    rangeOverflow: 'Максимально допустимое значение: ',
    badInput: 'Неверный формат ввода: допустимы только числа.',

    // Выдача динамически составленной ошибки "Значение слишком короткое"
    getValueShortDynamicError: function (currentLength) {
      return this.valueShort + currentLength + '.';
    },
    // Выдача динамически составленной ошибки "Значение слишком длинное"
    getValueLongDynamicError: function (currentLength) {
      return this.valueLong + currentLength + '.';
    },
    // Выдача динамически составленной ошибки "Число меньше допустимого минимума"
    getRangeUnderflowDynamicError: function (currentLimit) {
      return this.rangeUnderflow + currentLimit + '.';
    },
    // Выдача динамически составленной ошибки "Число больше допустимого максимума"
    getRangeOverflowDynamicError: function (currentLimit) {
      return this.rangeOverflow + currentLimit + '.';
    }
  }
};
