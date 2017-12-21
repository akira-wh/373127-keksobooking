'use strict';

/*
***********************************************************************************
***********************************************************************************
***
***                               ФИЛЬТРАЦИЯ ОБЪЯВЛЕНИЙ
***
***********************************************************************************
***********************************************************************************
*/

(function () {

  window.filters = {

    /**
     * Глобальный метод, активирущий работу фильтров.
     *
     * @method activate
     */
    activate: function () {
      var filtersNumber = window.constants.FILTERS.length;

      for (var i = 0; i < filtersNumber; i++) {
        window.constants.FILTERS[i].addEventListener('change', function () {
          var criteriaList = determineCriteria();
          var chosenCards = choseCards(criteriaList);

          var pins = window.constants.PINS_CONTAINER.querySelectorAll('button:not(.map__pin--main)');
          for (var j = 0; j < pins.length; j++) {
            pins[j].parentNode.removeChild(pins[j]);
          }

          window.showPins(chosenCards.length, chosenCards);
        });
      }
    }
  };

  /**
   * Определение критериев фильтрации — с ними позже сравниваются объявления.
   *
   * @function determineCriteria
   * @return {object} — объект с ключами и значениями требуемых критериев
   */
  function determineCriteria() {

    // Объект-буфер, в который собираются требования к фильтруемым объявлениям
    var criteriaList = {
      features: []
    };
    var filters = Array.from(window.constants.FILTERS);

    filters.forEach(function (currentFilter) {
      if (currentFilter.tagName.toLowerCase() === 'select') {
        var prefix = window.constants.USELESS_PREFIX_CHARS;
        var currentType = currentFilter.id.substring(prefix);

        criteriaList[currentType] = currentFilter.value;
      } else if (currentFilter.checked === true && criteriaList.features.indexOf(currentFilter.value) === -1) {
        criteriaList.features.push(currentFilter.value);
      }
    });

    return criteriaList;
  }

  /**
   * Сравнение и отбор объявлений согласно переданным критериям.
   *
   * @function choseCards
   * @param {object} criteriaList — объект с критериями отбора
   * @return {array} — массив с избранными объявлениями
   */
  function choseCards(criteriaList) {
    var data = window.data;

    var filtredData = data.filter(function (card) {
      if ((card.offer.type === criteriaList.type || criteriaList.type === 'any') &&
          (card.offer.rooms === criteriaList.rooms || criteriaList.rooms === 'any') &&
          (card.offer.guests === criteriaList.guests || criteriaList.guests === 'any') &&
          (comparePrice(card.offer.price, criteriaList.price))) {

        // Объявление подходит и добавляется в новый массив
        return true;
      } else {
        return false;
      }
    });

    // Если длина отфильтрованного массива больше
    if (filtredData.length > window.constants.PINS_MAX_LIMIT) {
      filtredData.splice(window.constants.PINS_MAX_LIMIT);
    }

    return filtredData;
  }

  /**
   * Сравнение цены с ценовым условием, заданным при фильтрации.
   *
   * @function comparePrice
   * @param {number} priceNumber — цена сравниваемого элемента
   * @param {*} priceCondition — условие цены согласно фильтру
   * @return {boolean} — ответ подходит цена или нет
   */
  function comparePrice(priceNumber, priceCondition) {
    if (priceCondition === 'low' && priceNumber < 10000) {
      return true;
    } else if (priceCondition === 'middle' && ((priceNumber > 10000) && (priceNumber < 50000))) {
      return true;
    } else if (priceCondition === 'hign' && priceNumber > 50000) {
      return true;
    } else if (priceCondition === 'any') {
      return true;
    } else {
      return false;
    }
  }
})();
