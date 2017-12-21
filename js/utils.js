'use strict';

/*
***********************************************************************************
***********************************************************************************
***
***                             УТИЛИТЫ ОБЩЕГО НАЗНАЧЕНИЯ
***
***********************************************************************************
***********************************************************************************
*/

(function () {

  window.utils = {

    /**
     * Генерация случайного числа в диапазоне (minValue и maxValue участвуют).
     *
     * @method getRandomInteger
     * @param {number} minValue — минимально допустимое число
     * @param {number} maxValue — максимально допустимое число
     * @return {number} — искомое случайное число
     */
    getRandomInteger: function (minValue, maxValue) {
      var randomInteger = minValue + Math.random() * (maxValue + 1 - minValue);
      randomInteger = Math.floor(randomInteger);

      return randomInteger;
    },

    /**
     * Выбор из массива рандомного элемента и возвращение его значения.
     *
     * @method getRandomElementFromArray
     * @param {array} sourceElements — входной массив с элементами на выбор
     * @return {string} — значение рандомного элемента
     */
    getRandomElementFromArray: function (sourceElements) {
      var maxIndex = sourceElements.length - 1;
      var randomIndex = this.getRandomInteger(0, maxIndex);
      var requestedElement = sourceElements[randomIndex];

      return requestedElement;
    },

    /**
     * Генерация массива неповторяющихся целых чисел в заданном диапазоне и заданной длины.
     *
     * @method getNonrepeatingIntegers
     * @param {number} minValue — минимально допустимое число
     * @param {number} maxValue — максимально допустимое число
     * @param {number} expectedLength — ожидаемая длина выходного массива
     * @return {array} — массив рандомных неповторяющихся чисел
     */
    getNonrepeatingIntegers: function (minValue, maxValue, expectedLength) {
      var nonrepeatingIntegers = [];
      var i = 0;
      var uniqueIndex = -1;

      while (i < expectedLength) {
        var newNumber = this.getRandomInteger(minValue, maxValue);

        if (nonrepeatingIntegers.indexOf(newNumber) === uniqueIndex) {
          nonrepeatingIntegers.push(newNumber);
          i++;
        } else {
          continue;
        }
      }

      return nonrepeatingIntegers;
    }
  };
})();
