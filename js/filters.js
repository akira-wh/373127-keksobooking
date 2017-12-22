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
     * Проходами собирает со всех фильтров актуальную информацию,
     * формирует список пользовательских критериев,
     * собирает массив подходящих объявлений,
     * удаляет со страницы старые объявления,
     * отрисовывает новые.
     *
     * @method activate
     */
    activate: function () {
      var filtersNumber = window.constants.FILTERS.length;

      for (var i = 0; i < filtersNumber; i++) {
        window.constants.FILTERS[i].addEventListener('change', function () {
          window.debounce(applyFiltering);
        });
      }
    }
  };

  /**
   * Основная механика фильтрации объявлений
   *
   * @function applyFiltering
   */
  function applyFiltering() {
    var criteriaList = determineCriteria();
    var filtredData = filterData(criteriaList);
    var pinsNumber = filtredData.length;

    removeUselessPins();
    window.showPins(pinsNumber, filtredData);
  }

  /**
   * Определение списка критериев фильтрации — заполнение специального объекта.
   *
   * @function determineCriteria
   * @return {object} — объект с ключами и значениями искомых объявлений
   */
  function determineCriteria() {
    // Объект-буфер, заполняется по ходу итераций forEach
    var criteriaList = {
      features: []
    };
    var filters = Array.from(window.constants.FILTERS);

    filters.forEach(function (currentFilter) {
      if (currentFilter.tagName.toLowerCase() === 'select') {
        var prefix = window.constants.USELESS_PREFIX_CHARS;
        var currentType = currentFilter.id.substring(prefix);

        if ((currentType === 'rooms' && currentFilter.value !== 'any') ||
          (currentType === 'guests' && currentFilter.value !== 'any')) {
          criteriaList[currentType] = Number(currentFilter.value);
        } else {
          criteriaList[currentType] = currentFilter.value;
        }

      } else if (currentFilter.checked === true && criteriaList.features.indexOf(currentFilter.value) === -1) {
        criteriaList.features.push(currentFilter.value);
      }
    });

    return criteriaList;
  }

  /**
   * Сравнение и отбор объявлений согласно установленным критериям.
   * Отбор происходит из глобальной базы window.data[].
   * На выходе — массив подходящих объявлений.
   *
   * @function filterData
   * @param {object} criteriaList — объект с критериями отбора
   * @return {array} — массив с избранными объявлениями
   */
  function filterData(criteriaList) {
    var data = window.data;

    var filtredData = data.filter(function (card) {
      if ((card.offer.type === criteriaList.type || criteriaList.type === 'any') &&
          (card.offer.rooms === criteriaList.rooms || criteriaList.rooms === 'any') &&
          (card.offer.guests === criteriaList.guests || criteriaList.guests === 'any') &&
          (comparePrice(card.offer.price, criteriaList.price)) &&
          (compareFeatures(card.offer.features, criteriaList.features))) {

        // Если объявление удовлетворяет условиям — добавляется в новый массив
        return true;
      } else {
        return false;
      }
    });

    // Если длина отфильтрованного массива оказывается больше,
    // чем допустимое количество одновременно находящихся на странице
    // объявлений (5) — избыточные элементы удаляются
    if (filtredData.length > window.constants.PINS_MAX_LIMIT) {
      filtredData.splice(window.constants.PINS_MAX_LIMIT);
    }

    return filtredData;
  }

  /**
   * Сравнение проверяемой цены с ценовым условием, заданным фильтрацией.
   *
   * @function comparePrice
   * @param {number} comparedPrice — цена сравниваемого элемента
   * @param {string} priceCondition — условие цены согласно фильтру
   * @return {boolean} — подходит/не подходит
   */
  function comparePrice(comparedPrice, priceCondition) {
    if (priceCondition === 'low' && comparedPrice < 10000) {
      return true;
    } else if (priceCondition === 'middle' && ((comparedPrice > 10000) && (comparedPrice < 50000))) {
      return true;
    } else if (priceCondition === 'high' && comparedPrice > 50000) {
      return true;
    } else if (priceCondition === 'any') {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Сравнение проверяемого массива преимуществ
   * с условием по преимуществам, заданным фильтрацией.
   *
   * @function comparePrice
   * @param {number} comparedFeatures — преимущества сравниваемого элемента
   * @param {string} requestedFeatures — запрос по преимуществам согласно фильтру
   * @return {boolean} — подходит/не подходит
   */
  function compareFeatures(comparedFeatures, requestedFeatures) {
    var requestedFeaturesNumber = requestedFeatures.length;
    // Счетчик совпадений по запросу
    var matches = 0;

    // Если не запрошено ничего конкретного — объявление подходит
    if (requestedFeaturesNumber === 0) {
      return true;
    }

    // Если запрошено — проверка
    for (var i = 0; i < requestedFeaturesNumber; i++) {
      if (comparedFeatures.indexOf(requestedFeatures[i]) !== -1) {
        matches++;
      }
    }

    // Если все запрошенные преимущества имеются — объявление подходит
    if (matches === requestedFeaturesNumber) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Очистка карты пинов.
   * Применяется перед отрисовкой новых.
   *
   * @function removeUselessPins
   */
  function removeUselessPins() {
    var pins = window.constants.PINS_CONTAINER.querySelectorAll('button:not(.map__pin--main)');
    var pinsNumber = pins.length;

    for (var i = 0; i < pinsNumber; i++) {
      pins[i].parentNode.removeChild(pins[i]);
    }
  }
})();
