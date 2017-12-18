'use strict';

/*
***********************************************************************************
***********************************************************************************
***
***     ГЕНЕРАЦИЯ ОБЪЕКТОВ-ОБЪЯВЛЕНИЙ В ГЛОБАЛЬНЫЙ МАССИВ window.data.offers[]
***
***********************************************************************************
***********************************************************************************
*/

(function () {

  // Создание и заполнение глобального массива объявлений.
  window.data = {
    offers: generateOffers(8),

    /**
     * Расшифровка типа недвижимости для удобочитаемости на клиентской стороне.
     * Обозначения "flat", "house" etc. русифицируются в "квартира", "дом", и тд.
     *
     * @method decodePropertyType
     * @param {string} currentType — ключ для расшифровки
     * @param {object} sourceTypes — входной объект с библиотекой ключей/значений
     * @return {string} — расшифрованное значение
     */
    decodePropertyType: function (currentType, sourceTypes) {
      var requestedDefinition = 'Тип недвижимости не определен';

      for (var key in sourceTypes) {
        if (currentType === key) {
          requestedDefinition = sourceTypes[key];

          return requestedDefinition;
        }
      }

      return requestedDefinition;
    }
  };

  /**
   * Создание и заполнение массива объектами-объявлениями.
   *
   * @function generateOffers
   * @param {number} expectedNumber — необходимое количество объектов-объявлений
   * @return {array} — заполненный массив
   */
  function generateOffers(expectedNumber) {
    var requestedOffers = [];

    for (var i = 0; i < expectedNumber; i++) {
      var avatarSerial = i + 1; // Нумерация аватаров начинаются с 1, а не 0
      var selectedLocationX = window.utils.getRandomInteger(300, 900);
      var selectedLocationY = window.utils.getRandomInteger(100, 500);
      var selectedTitle = window.constants.OFFERS_TITLES[i];

      requestedOffers[i] = {
        author: {
          avatar: 'img/avatars/user0' + avatarSerial + '.png'
        },

        offer: {
          title: selectedTitle,
          price: window.utils.getRandomInteger(1000, 1000000),
          type: determinePropertyType(selectedTitle),
          rooms: window.utils.getRandomInteger(1, 5),
          guests: window.utils.getRandomInteger(0, 20),
          checkin: window.utils.getRandomElementFromArray(window.constants.OFFERS_TIMES),
          checkout: window.utils.getRandomElementFromArray(window.constants.OFFERS_TIMES),
          features: window.utils.generateUniqueCollection(window.constants.OFFERS_FEATURES),
          description: '',
          photos: [],
          address: selectedLocationX + ', ' + selectedLocationY
        },

        location: {
          x: selectedLocationX,
          y: selectedLocationY
        }
      };
    }

    return requestedOffers;
  }

  /**
   * Определение по заголовку объявления соответствующий ему тип недвижимости.
   * Определение происходит по ключевым словам, например "..квартира.." -> flat etc.
   *
   * @function determinePropertyType
   * @param {string} title — входной заголовок объявления для анализа
   * @return {string} — тип недвижимости, подходящий заголовку объявления
   */
  function determinePropertyType(title) {
    title = title.toLowerCase();

    if (title.indexOf('квартира') !== -1) {
      var requestedType = 'flat';
    } else if (title.indexOf('дворец') !== -1 || title.indexOf('домик') !== -1) {
      requestedType = 'house';
    } else if (title.indexOf('бунгало') !== -1) {
      requestedType = 'bungalo';
    } else {
      requestedType = 'Тип недвижимости неопределен';
    }

    return requestedType;
  }
})();
