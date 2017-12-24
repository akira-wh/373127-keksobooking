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
   * Информационная составляющая снимается с объявлений window.data[].
   * Разметка основывается на шаблоне <article class="map__card"> из списка <template>.
   *
   * @method showCard
   * @param {array} sourceOffers — входной массив с объявлениями для съема данных
   * @param {number} offerIndex — индекс необходимого объявления
   */
  window.showCard = function (sourceOffers, offerIndex) {
    var cardFragment = document.createDocumentFragment();
    var card = window.constants.CARD_TEMPLATE.cloneNode(true);

    var avatar = card.querySelector('.popup__avatar');
    var title = card.querySelector('h3');
    var address = card.querySelector('small');
    var price = card.querySelector('.popup__price');
    var type = card.querySelector('h4');
    var capacity = card.querySelector('h4 + p');
    var stayTime = card.querySelector('h4 + p + p');
    var description = card.querySelector('ul + p');
    var featuresList = card.querySelector('.popup__features');
    var photosList = card.querySelector('.popup__pictures');

    var source = sourceOffers[offerIndex];

    card.style.zIndex = window.constants.CARD_SUPERIORITY_Z_INDEX;
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
    photosList.innerHTML = '';
    photosList.appendChild(createPhotosMarkup(source.offer.photos));

    cardFragment.appendChild(card);
    window.constants.MAP.insertBefore(cardFragment, window.constants.CARD_PLACEMENT);
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
   * Обозначения "flat", "house" etc. переводятся в "квартира", "дом", и тд.
   *
   * @function decodePropertyType
   * @param {string} currentType — ключ для расшифровки
   * @param {object} sourceTypes — объект с библиотекой ключей/расшифровок
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
      var featuresListItem = document.createElement('li');
      featuresListItem.className = 'feature  feature--' + sourceFeatures[i];

      featuresFragment.appendChild(featuresListItem);
    }

    return featuresFragment;
  }

  /**
  * Создание на основе списка SRC фотографий — соответствующей HTML разметки.
  *
  * @function createPhotosMarkup
  * @param {array} sourcePhotos — входной массив с src фотографий
  * @return {object} — фрагмент документа с готовой HTML разметкой
  */
  function createPhotosMarkup(sourcePhotos) {
    var photosFragment = document.createDocumentFragment();
    var photosNumber = sourcePhotos.length;

    for (var i = 0; i < photosNumber; i++) {
      var photosListItem = document.createElement('li');
      var photo = document.createElement('img');

      photo.src = sourcePhotos[i];
      photo.width = window.constants.PHOTOS_MAX_WIDTH;

      photosListItem.appendChild(photo);
      photosFragment.appendChild(photosListItem);
    }

    return photosFragment;
  }
})();
