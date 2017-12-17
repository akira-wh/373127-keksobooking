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

  window.form = {

    /**
     * Приведение формы создания объявлений к необходимомму состоянию по умолчанию.
     * fieldset'ы формы заблокированы, форме установлен ACTION="" и другие default атрибуты.
     * Метод самозапускается при загрузке сайта.
     *
     * @method setDefaults
     */
    setDefaults: (function () {
      window.constants.FORM.action = window.constants.FORM_ACTION_URL;

      setFieldsetsAvailability(false);

      var inputTitle = window.constants.FORM.querySelector('input#title');
      inputTitle.minLength = 30;
      inputTitle.maxLength = 100;
      inputTitle.required = true;

      var inputAddress = window.constants.FORM.querySelector('input#address');
      // default координаты управляющего пина (центр, указательная пика)
      inputAddress.value = 'x: 600, y: 420';
      inputAddress.readOnly = true;
      inputAddress.tabIndex = -1;

      var inputPropertyPrice = window.constants.FORM.querySelector('input#price');
      inputPropertyPrice.placeholder = 1000;
      inputPropertyPrice.min = 1000;
      inputPropertyPrice.max = 1000000;
      inputPropertyPrice.required = true;

      var selectPropertyCapacity = window.constants.FORM.querySelector('select#capacity');
      selectPropertyCapacity.selectedIndex = 2;
    })(),

    /**
     * Активация формы создания объявлений, контроль синхронизации и валидности.
     *
     * Удаление у <form> блокирующего класса .notice__form--disabled,
     * а у всех <fieldset> — блокирующего атрибута disabled.
     * По синхронизации и валидации см.документацию связанных функций ниже.
     *
     * @method activate
     */
    activate: function () {
      // Активация формы и fieldset'ов
      window.constants.FORM.classList.remove('notice__form--disabled');

      setFieldsetsAvailability(true);

      // Контроль синхронизации полей:
      // "Тип жилья", "Цена за ночь", "Время заезда и выезда", "Количество комнат и мест"
      var selectCheckin = window.constants.FORM.querySelector('select#timein');
      var selectCheckout = window.constants.FORM.querySelector('select#timeout');
      selectCheckin.addEventListener('change', function (evt) {
        syncFormTimes(selectCheckin, selectCheckout, evt);
      });
      selectCheckout.addEventListener('change', function (evt) {
        syncFormTimes(selectCheckin, selectCheckout, evt);
      });

      var selectPropertyType = window.constants.FORM.querySelector('select#type');
      var inputPropertyPrice = window.constants.FORM.querySelector('input#price');
      selectPropertyType.addEventListener('change', function () {
        syncFormPropertyPrice(selectPropertyType, inputPropertyPrice);
      });

      var selectRoomsNumber = window.constants.FORM.querySelector('select#room_number');
      var selectPropertyCapacity = window.constants.FORM.querySelector('select#capacity');
      selectRoomsNumber.addEventListener('change', function () {
        syncFormPropertyCapacity(selectRoomsNumber, selectPropertyCapacity);
      });

      // Проверка вводимых данных на валидность
      var inputTitle = window.constants.FORM.querySelector('input#title');
      var inputPrice = window.constants.FORM.querySelector('input#price');
      inputTitle.addEventListener('input', onInvalidInput);
      inputTitle.addEventListener('invalid', onInvalidInput);
      inputPrice.addEventListener('input', onInvalidInput);
      inputPrice.addEventListener('invalid', onInvalidInput);
    }
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
   * Активация/деактивация всех fieldset формы.
   *
   * @function setFieldsetsAvailability
   * @param {boolean} booleanStatus — true, чтобы включить / false, чтобы выключить
   */
  function setFieldsetsAvailability(booleanStatus) {
    var fieldsets = window.constants.FORM.querySelectorAll('fieldset');
    var fieldsetsNumber = fieldsets.length;

    for (var i = 0; i < fieldsetsNumber; i++) {
      fieldsets[i].disabled = !booleanStatus;
    }
  }

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
        inputPropertyPrice.placeholder = 0; // Стоимость 0
        inputPropertyPrice.min = 0;
        break;
      case 1: // Квартира
        inputPropertyPrice.placeholder = 1000; // Стоимость 1.000
        inputPropertyPrice.min = 1000;
        break;
      case 2: // Дом
        inputPropertyPrice.placeholder = 5000; // Стоимость 5.000
        inputPropertyPrice.min = 5000;
        break;
      case 3: // Дворец
        inputPropertyPrice.placeholder = 10000; // Стоимость 10.000
        inputPropertyPrice.min = 10000;
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
    var isMaxLengthExist = maxLength > 0;

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
