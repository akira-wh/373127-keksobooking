'use strict';

/*
***********************************************************************************
***********************************************************************************
***
***                          РАЗМЕТКА + ОТРИСОВКА НА КАРТЕ
***                               ВЫБРАННЫХ ОБЪЯВЛЕНИЙ
***
***********************************************************************************
***********************************************************************************
*/

(function () {

  /**
   * Создание и отрисовка необходимого объявления.
   *
   * Создается Document Fragment, заполняется разметкой и внедряется на страницу.
   * Информационная составляющая снимается с объектов-объявлений массива window.data.offers[].
   * Разметка основывается на шаблоне <article class="map__card"> из списка <template>.
   *
   * @method showCard
   * @param {array} sourceOffers — входной массив с объявлениями для съема данных
   * @param {number} offerIndex — индекс необходимого объявления
   */
  window.showCard = function (sourceOffers, offerIndex) {
    var cardTemplate = document.querySelector('template').content.querySelector('.map__card');
    var cardFragment = document.createDocumentFragment();
    var card = cardTemplate.cloneNode(true);

    var avatar = card.querySelector('.popup__avatar');
    var title = card.querySelector('h3');
    var address = card.querySelector('small');
    var price = card.querySelector('.popup__price');
    var type = card.querySelector('h4');
    var capacity = card.querySelector('h4 + p');
    var stayTime = card.querySelector('h4 + p + p');
    var description = card.querySelector('ul + p');
    var featuresList = card.querySelector('.popup__features');

    var source = sourceOffers[offerIndex];

    avatar.src = source.author.avatar;
    title.textContent = source.offer.title;
    address.textContent = source.offer.address;
    price.textContent = source.offer.price + '\u20bd / ночь';
    type.textContent = window.data.decodePropertyType(source.offer.type, window.constants.OFFERS_PROPERTY_TYPES);
    capacity.textContent = source.offer.rooms + ' комнаты для ' + source.offer.guests + ' гостей';
    stayTime.textContent = 'Заезд после ' + source.offer.checkin + ', выезд до ' + source.offer.checkout;
    description.textContent = source.offer.description;
    featuresList.innerHTML = '';
    featuresList.appendChild(createFeaturesMarkup(source.offer.features));

    cardFragment.appendChild(card);

    var cardInsertPoint = window.constants.MAP.querySelector('.map__filters-container');
    window.constants.MAP.insertBefore(cardFragment, cardInsertPoint);
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
