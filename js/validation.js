'use strict';

/*
***********************************************************************************
***********************************************************************************
***
***                                 ВАЛИДАЦИЯ ПОЛЕЙ ФОРМЫ
***
***********************************************************************************
***********************************************************************************
*/

(function () {

  window.validation = {

    /**
     * Контроль валидности объекта события.
     * Выдача custom-ошибок и подсветка полей красным цветом.
     *
     * @method onInvalidInput
     * @param {object} evt — объект события, объект проверки на валидность
     */
    onInvalidInput: function (evt) {
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
  };
})();
