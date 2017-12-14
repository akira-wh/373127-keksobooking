'use strict';

/*
***********************************************************************************
***********************************************************************************
***
***                             ФОРМА СОЗДАНИЯ ОБЪЯВЛЕНИЙ:
***                     АКТИВАЦИЯ, СИНХРОНИЗАЦИЯ ПОЛЕЙ И ВАЛИДАЦИЯ
***
***********************************************************************************
***********************************************************************************
*/

(function () {

  /**
  * Активация формы создания объявлений, контроль синхронизации полей и их валидности.
  *
  * Удаление у <form> блокирующего класса .notice__form--disabled, у <fieldset> — атрибута disabled.
  * По синхронизации и валидации см.документацию связанных функций ниже.
  *
  * @function activateUserForm
  */
  window.activateUserForm = function () {

    // Активация формы и fieldset'ов
    var fieldsets = window.constants.USER_FORM.querySelectorAll('fieldset');
    var fieldsetsNumber = fieldsets.length;

    window.constants.USER_FORM.classList.remove('notice__form--disabled');

    for (var i = 0; i < fieldsetsNumber; i++) {
      fieldsets[i].disabled = false;
    }

    // Контроль синхронизации необходимых полей
    var selectCheckin = window.constants.USER_FORM.querySelector('select#timein');
    var selectCheckout = window.constants.USER_FORM.querySelector('select#timeout');
    selectCheckin.addEventListener('input', function (evt) {
      syncFormTimes(selectCheckin, selectCheckout, evt);
    });
    selectCheckout.addEventListener('input', function (evt) {
      syncFormTimes(selectCheckin, selectCheckout, evt);
    });

    var selectPropertyType = window.constants.USER_FORM.querySelector('select#type');
    var inputPropertyPrice = window.constants.USER_FORM.querySelector('input#price');
    selectPropertyType.addEventListener('input', function () {
      syncFormPropertyPrice(selectPropertyType, inputPropertyPrice);
    });

    var selectRoomsNumber = window.constants.USER_FORM.querySelector('select#room_number');
    var selectPropertyCapacity = window.constants.USER_FORM.querySelector('select#capacity');
    selectRoomsNumber.addEventListener('input', function () {
      syncFormPropertyCapacity(selectRoomsNumber, selectPropertyCapacity);
    });

    // Проверка вводимых данных на валидность
    var inputTitle = window.constants.USER_FORM.querySelector('input#title');
    var inputPrice = window.constants.USER_FORM.querySelector('input#price');
    inputTitle.addEventListener('input', onInvalidInput);
    inputTitle.addEventListener('invalid', onInvalidInput);
    inputPrice.addEventListener('input', onInvalidInput);
    inputPrice.addEventListener('invalid', onInvalidInput);
  };

  /*
  ***********************************************************************************
  ***********************************************************************************
  ***
  ***                             ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ:
  ***                              МЕХАНИКА СИНХРОНИЗАЦИИ
  ***
  ***********************************************************************************
  ***********************************************************************************
  */

  /**
  * Синхронизация опций селектов "Время заезда и выезда" в форме создания объявлений.
  * Одним из параметров передается объект события (в каком селекте изменения),
  * с учетом которого изменяется противоположный селект.
  *
  * @function syncFormTimes
  * @param {node} selectCheckin — <select> #timein
  * @param {node} selectCheckout — <select> #timeout
  * @param {object} evt — объект события, объект случившихся изменений
  */
  function syncFormTimes(selectCheckin, selectCheckout, evt) {
    if (evt.target === selectCheckin) {
      selectCheckout.selectedIndex = selectCheckin.selectedIndex;
    } else if (evt.target === selectCheckout) {
      selectCheckin.selectedIndex = selectCheckout.selectedIndex;
    }
  }

  /**
  * Синхронизация опций селекта "Тип жилья" с подсказкой и ограничениями в "Цена за ночь".
  *
  * @function syncFormPropertyPrice
  * @param {node} selectPropertyType — <select> #type
  * @param {node} inputPropertyPrice — <input> #price
  */
  function syncFormPropertyPrice(selectPropertyType, inputPropertyPrice) {
    switch (selectPropertyType.selectedIndex) {
      case 0: // Лачуга
        inputPropertyPrice.placeholder = '0'; // Стоимость 0
        inputPropertyPrice.min = '0';
        break;
      case 1: // Квартира
        inputPropertyPrice.placeholder = '1000'; // Стоимость 1.000
        inputPropertyPrice.min = '1000';
        break;
      case 2: // Дом
        inputPropertyPrice.placeholder = '5000'; // Стоимость 5.000
        inputPropertyPrice.min = '5000';
        break;
      case 3: // Дворец
        inputPropertyPrice.placeholder = '10000'; // Стоимость 10.000
        inputPropertyPrice.min = '10000';
        break;
    }
  }

  /**
  * Синхронизация опций селектов "Количество комнат" и "Количество мест".
  *
  * @function syncFormPropertyCapacity
  * @param {node} selectRoomsNumber — <select> #room_number
  * @param {node} selectPropertyCapacity — <select> #capacity
  */
  function syncFormPropertyCapacity(selectRoomsNumber, selectPropertyCapacity) {
    switch (selectRoomsNumber.selectedIndex) {
      case 0: // 1 комната
        selectPropertyCapacity.selectedIndex = 2; // для 1 гостя
        break;
      case 1: // 2 комнаты
        selectPropertyCapacity.selectedIndex = 1; // для 2-х гостей
        break;
      case 2: // 3 комнаты
        selectPropertyCapacity.selectedIndex = 0; // для 3-х гостей
        break;
      case 3: // 100 комнат
        selectPropertyCapacity.selectedIndex = 3; // не для гостей
        break;
    }
  }

  /*
  ***********************************************************************************
  ***********************************************************************************
  ***
  ***                               МЕХАНИКА ВАЛИДАЦИИ
  ***
  ***********************************************************************************
  ***********************************************************************************
  */

  /**
  * Контроль валидности объекта события.
  * Выдача custom-ошибок и подсветка полей красным цветом.
  *
  * @function onInvalidInput
  * @param {object} evt — объект события
  */
  function onInvalidInput(evt) {
    var target = evt.target;

    var currentValueLength = target.value.length; // Текущая длина значения
    var minLength = target.minLength; // Ограничение минимальной длины
    var maxLength = target.maxLength; // Ограничение максимальной длины
    var isMinLengthExist = minLength > 0; // Проверка есть ли вообще ограничение длины
    var isMaxLengthExist = minLength > 0;

    if (target.validity.valueMissing) {
      if (target.validity.badInput) {
        var message = window.constants.INPUT_ERRORS.badInput;
      } else {
        message = window.constants.INPUT_ERRORS.valueMissing;
      }
    } else if (target.validity.tooShort || (isMinLengthExist && currentValueLength < minLength)) {
      message = window.constants.INPUT_ERRORS.getValueShortDynamicError(currentValueLength);
    } else if (target.validity.tooLong || (isMaxLengthExist && currentValueLength > maxLength)) {
      message = window.constants.INPUT_ERRORS.getValueLongDynamicError(currentValueLength);
    } else if (target.validity.rangeUnderflow) {
      var minRange = target.min;
      message = window.constants.INPUT_ERRORS.getRangeUnderflowDynamicError(minRange);
    } else if (target.validity.rangeOverflow) {
      var maxRange = target.max;
      message = window.constants.INPUT_ERRORS.getRangeOverflowDynamicError(maxRange);
    } else {
      message = '';
    }

    target.setCustomValidity(message);

    if (message === '') {
      target.style.border = '';
    } else {
      target.style.border = '2px solid crimson';
    }
  }
})();
