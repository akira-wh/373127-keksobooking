'use strict';

/*
***********************************************************************************
***********************************************************************************
***
***                          РАЗМЕТКА + ОТРИСОВКА НА КАРТЕ
***                          ПИНОВ И ВЫБРАННЫХ ОБЪЯВЛЕНИЙ
***
***********************************************************************************
***********************************************************************************
*/

(function () {

  window.render = {

    /**
    * Создание и отрисовка пользовательских пинов.
    *
    * Создается Document Fragment, заполняется разметкой и внедряется на страницу.
    * Информационная составляющая снимается с объектов-объявлений массива window.data.offers[].
    * Разметка каждого пина основана на шаблоне <button class="map__pin"> из списка <template>.
    *
    * @method renderPins
    * @param {number} expectedNumber — необходимое число отрисованных пинов
    * @param {array} sourceOffers — массив объектов-объявлений для съема данных
    */
    renderPins: function (expectedNumber, sourceOffers) {
      var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
      var pinsFragment = document.createDocumentFragment();

      for (var i = 0; i < expectedNumber; i++) {
        var pin = pinTemplate.cloneNode(true);
        var img = pin.querySelector('img');

        pin.style.left = sourceOffers[i].location.x - window.constants.PIN_SHIFT_X + 'px';
        pin.style.top = sourceOffers[i].location.y - window.constants.PIN_SHIFT_Y + 'px';
        img.src = sourceOffers[i].author.avatar;

        pinsFragment.appendChild(pin);
      }

      window.constants.PINS_CONTAINER.appendChild(pinsFragment);
    },

    /**
    * Создание и отрисовка необходимого объявления.
    *
    * Создается Document Fragment, заполняется разметкой и внедряется на страницу.
    * Информационная составляющая снимается с объектов-объявлений массива window.data.offers[].
    * Разметка основывается на шаблоне <article class="map__card"> из списка <template>.
    *
    * @method renderOffer
    * @param {array} sourceOffers — входной массив с объявлениями для съема данных
    * @param {number} index — индекс необходимого объявления
    */
    renderOffer: function (sourceOffers, index) {
      var offerTemplate = document.querySelector('template').content.querySelector('.map__card');
      var offerFragment = document.createDocumentFragment();
      var offer = offerTemplate.cloneNode(true);

      var avatar = offer.querySelector('.popup__avatar');
      var title = offer.querySelector('h3');
      var address = offer.querySelector('small');
      var price = offer.querySelector('.popup__price');
      var type = offer.querySelector('h4');
      var capacity = offer.querySelector('h4 + p');
      var stayTime = offer.querySelector('h4 + p + p');
      var description = offer.querySelector('ul + p');
      var featuresList = offer.querySelector('.popup__features');

      var source = sourceOffers[index];

      avatar.src = source.author.avatar;
      title.textContent = source.offer.title;
      address.textContent = source.offer.address;
      price.textContent = source.offer.price + '\u20bd / ночь';
      type.textContent = decodePropertyType(source.offer.type, window.constants.OFFERS_PROPERTY_TYPES);
      capacity.textContent = source.offer.rooms + ' комнаты для ' + source.offer.guests + ' гостей';
      stayTime.textContent = 'Заезд после ' + source.offer.checkin + ', выезд до ' + source.offer.checkout;
      description.textContent = source.offer.description;
      featuresList.innerHTML = '';
      featuresList.appendChild(createFeaturesMarkup(source.offer.features));

      offerFragment.appendChild(offer);

      var offerInsertPoint = window.constants.MAP.querySelector('.map__filters-container');
      window.constants.MAP.insertBefore(offerFragment, offerInsertPoint);
    }
  };

  /*
  ***********************************************************************************
  ***********************************************************************************
  ***
  ***                             ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
  ***
  ***********************************************************************************
  ***********************************************************************************
  */

  /**
  * Расшифровка типа недвижимости для удобочитаемости на клиентской стороне.
  * Обозначения "flat", "house" etc. русифицируются в "квартира", "дом", и тд.
  *
  * @function decodePropertyType
  * @param {string} currentType — ключ для расшифровки
  * @param {object} sourceTypes — входной объект с библиотекой ключей/значений
  * @return {string} — расшифрованное значение
  */
  function decodePropertyType(currentType, sourceTypes) {
    var requestedDefinition = 'Тип недвижимости не определен';

    for (var key in sourceTypes) {
      if (currentType === key) {
        requestedDefinition = sourceTypes[key];

        return requestedDefinition;
      }
    }

    return requestedDefinition;
  }

  /**
  * Создание на основе списка преимуществ объекта — соответствующей HTML разметки.
  *
  * @param {array} sourceFeatures — входной массив со списком преимуществ
  * @return {object} — фрагмент документа с готовой HTML разметкой
  */
  function createFeaturesMarkup(sourceFeatures) {
    var featuresFragment = document.createDocumentFragment();
    var featuresNumber = sourceFeatures.length;

    for (var i = 0; i < featuresNumber; i++) {
      var featureTag = document.createElement('li');
      featureTag.className = 'feature  feature--' + sourceFeatures[i];

      featuresFragment.appendChild(featureTag);
    }

    return featuresFragment;
  }
})();
