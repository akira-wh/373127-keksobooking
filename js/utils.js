'use strict';

/*
***********************************************************************************
***********************************************************************************
***
***                   ВСПОМОГАТЕЛЬНЫЕ УТИЛИТЫ ОБЩЕГО НАЗНАЧЕНИЯ
***
***********************************************************************************
***********************************************************************************
*/

window.utils = {

  /**
  * Генерация случайного числа в указанном диапазоне (minValue и maxValue участвуют).
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
  * Выбор из входного массива рандомного элемента и возвращение его значения.
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
  * Создание нового набора элементов на основе вариантов из входного массива.
  * Элементы не повторяются, а их количество не превышает объем входного массива.
  * 1. Узнаем пороговую длину входного массива.
  * 2. Генерируем длину новой коллекции (не менее 1 элемента, не более длины входного массива).
  * 3. Создаем временно пустую коллекцию.
  * 4. Рандомно выбираем из входного массива элементы для новой коллекции.
  * 5. Копируем выбранные элементы.
  * 6. Отдаем подборку.
  *
  * @method generateUniqueCollection
  * @param {array} sourceElements — входной массив с вариантами для перекомпоновки
  * @return {array} — новая подборка
  */
  generateUniqueCollection: function (sourceElements) {
    var maxValue = sourceElements.length - 1;
    var newCollectionLength = this.getRandomInteger(1, maxValue);
    var selectedElements = this.getNonrepeatingIntegers(0, maxValue, newCollectionLength);

    var requestedCollection = [];

    for (var i = 0; i < newCollectionLength; i++) {
      requestedCollection.push(sourceElements[selectedElements[i]]);
    }

    return requestedCollection;
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
