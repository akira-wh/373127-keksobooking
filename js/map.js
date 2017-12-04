'use strict';


/*
***********************************************************************************
***********************************************************************************
***
***              БИБЛИОТЕКИ ДАННЫХ (ОБЪЕКТЫ, МАССИВЫ, КОНСТАНТЫ etc)
***
***********************************************************************************
***********************************************************************************
*/

// Массив — Заголовки предложений.
var offerTitles = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

// Массив — Типы жилья (ключи и расшифровки).
// Не объект, потому что необходим нумерованный список.
var offerPropertyTypes = [
  ['flat', 'Квартира'],
  ['house', 'Дом'],
  ['bungalo', 'Бунгало']
];

// Массив — Время checkin и checkout.
var offerTimes = [
  '12:00',
  '13:00',
  '14:00'
];

// Массив — Преимущества жилья.
var offerFeatures = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];


/*
***********************************************************************************
***********************************************************************************
***
***                             ГЕНЕРАЦИЯ ОБЪЯВЛЕНИЙ
***
***********************************************************************************
***********************************************************************************
*/

// Создание основного массива объявлений и заполнение его объектами данных.
var offers = [];
generateOffers(8, offers);

/**
* Функция, заполняющая входной массив объектами-объявлениями по недвижимости.
*
* @function generateOffers.
* @param {number} expectedNumber — необходимое количество конечных объектов.
* @param {array} targetArray — входной массив для заполнения объектами.
*/
function generateOffers(expectedNumber, targetArray) {
  for (var i = 0; i < expectedNumber; i++) {
    var avatarSerial = i + 1;
    var selectedLocationX = getRandomInteger(300, 900);
    var selectedLocationY = getRandomInteger(100, 500);
    var selectedTitle = offerTitles[i];

    targetArray[i] = {
      author: {
        avatar: 'img/avatars/user0' + avatarSerial + '.png'
      },

      offer: {
        title: selectedTitle,
        price: getRandomInteger(1000, 1000000),
        type: determineRightPropertyType(selectedTitle),
        rooms: getRandomInteger(1, 5),
        guests: getRandomInteger(0, 200),
        checkin: getRandomElementFromArray(offerTimes),
        checkout: getRandomElementFromArray(offerTimes),
        features: generateUniqueCollection(offerFeatures),
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
}

/**
* Функция, генерирующая случайное целое число в указанном диапазоне (minValue и maxValue участвуют).
*
* @function getRandomInteger.
* @param {number} minValue — минимально допустимое число.
* @param {number} maxValue — максимально допустимое число.
* @return {number} — искомое случайное число.
*/
function getRandomInteger(minValue, maxValue) {
  var randomInteger = minValue + Math.random() * (maxValue + 1 - minValue);
  randomInteger = Math.floor(randomInteger);

  return randomInteger;
}

/**
* Функция, выбирающая из входного массива рандомный элемент и возвращающая его значение.
*
* @function getRandomElementFromArray.
* @param {array} externalArray — входной массив с элементами на выбор.
* @return {string} — значение рандомного элемента.
*/
function getRandomElementFromArray(externalArray) {
  var maxIndex = externalArray.length - 1;
  var randomIndex = getRandomInteger(0, maxIndex);
  var requestedElement = externalArray[randomIndex];

  return requestedElement;
}

/**
* Функция, которая определяет по заголовку объявления соответствующий ему тип недвижимости..
*
* @function determineRightPropertyType.
* @param {string} workingTitle — входной заголовок объявления.
* @return {string} — определенный тип недвижимости.
*/
function determineRightPropertyType(workingTitle) {
  var types = offerPropertyTypes;
  var flat = 0;
  var house = 1;
  var bungalo = 2;

  if (workingTitle.indexOf('квартира') >= 0) {
    var requestedType = types[flat][0];
  } else if (workingTitle.indexOf('дворец') >= 0 || workingTitle.indexOf('домик') >= 0) {
    requestedType = types[house][0];
  } else if (workingTitle.indexOf('бунгало') >= 0) {
    requestedType = types[bungalo][0];
  } else {
    requestedType = 'Тип недвижимости неизвестен';
  }

  return requestedType;
}

/**
* Функция, создающая новый набор элементов на основе вариантов из входного массива.
* Элементы не повторяются, а их количество не превышает объем входного массива.
* 1. Узнаем пороговую длину входного массива.
* 2. Генерируем длину новой коллекции (не менее 1 элемента, не более длины входного массива).
* 3. Создаем временно пустую коллекцию.
* 4. Рандомно выбираем из входного массива элементы для новой коллекции.
* 5. Копируем выбранные элементы.
* 6. Отдаем подборку.
*
* @function generateUniqueCollection.
* @param {array} externalArray — входной массив с вариантами для перекомпоновки.
* @return {array} — новая подборка.
*/
function generateUniqueCollection(externalArray) {
  var maxLength = externalArray.length - 1;
  var newCollectionLength = getRandomInteger(1, maxLength);
  var requestedCollection = [];
  var selectedElements = getNonrepeatingIntegers(0, maxLength, newCollectionLength);

  for (var i = 0; i < newCollectionLength; i++) {
    requestedCollection.push(externalArray[selectedElements[i]]);
  }

  return requestedCollection;
}

/**
* Функция, генерирующая массив неповторяющихся целых чисел в заданном диапазоне и заданной длины.
*
* @function getNonrepeatingIntegers.
* @param {number} minValue — минимально допустимое число.
* @param {number} maxValue — максимально допустимое число.
* @param {number} expectedLength — ожидаемая длина выходного массива.
* @return {array} — массив рандомных неповторяющихся чисел.
*/
function getNonrepeatingIntegers(minValue, maxValue, expectedLength) {
  var nonrepeatingIntegers = [];
  var i = 0;
  var unique = -1;

  while (i < expectedLength) {
    var newNumber = getRandomInteger(minValue, maxValue);

    if (nonrepeatingIntegers.indexOf(newNumber) === unique) {
      nonrepeatingIntegers.push(newNumber);
      i++;
    } else {
      continue;
    }
  }

  return nonrepeatingIntegers;
}


/*
***********************************************************************************
***********************************************************************************
***
***         СОЗДАНИЕ РАЗМЕТКИ + ОТРИСОВКА НА КАРТЕ ПОЛЬЗОВАТЕЛЬСКИХ ПИНОВ
***
***********************************************************************************
***********************************************************************************
*/

// Получение и отображение карты пользовательских объявлений.
var offersMap = document.querySelector('.map');
offersMap.classList.remove('map--faded');

// Создание и отрисовка на карте пользовательских пинов (аватарок-кнопкок).
var pinsArea = offersMap.querySelector('.map__pins');
pinsArea.appendChild(renderPins());

/**
* Функция, создающая Document Fragment и заполняющая его разметкой пользовательских пинов.
* Разметка каждого пина основана на шаблоне <button><img></button> из списка <template>.
* Количество пинов на выходе соответствует количеству объектов-объявлений в массиве offers[].
*
* @function renderPins.
* @return {object} — Document Fragment с html разметкой.
*/
function renderPins() {
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var pinsFragment = document.createDocumentFragment();

  for (var i = 0; i < offers.length; i++) {
    var pin = pinTemplate.cloneNode(true);
    var img = pin.querySelector('img');
    var pinShiftX = 23; // смещение пина по X с учетом его размеров (в px).
    var pinShiftY = 62; // смещение пина по Y с учетом его размеров (в px).

    pin.style.left = offers[i].location.x + pinShiftX + 'px';
    pin.style.top = offers[i].location.y + pinShiftY + 'px';
    img.src = offers[i].author.avatar;

    pinsFragment.appendChild(pin);
  }

  return pinsFragment;
}


/*
***********************************************************************************
***********************************************************************************
***
***               СОЗДАНИЕ РАЗМЕТКИ + ОТРИСОВКА НА КАРТЕ ОБЪЯВЛЕНИЙ
***
***********************************************************************************
***********************************************************************************
*/

// Получение в разметке точки вставки объявлений, вставка и отрисовка их на карте.
var offersInsertPoint = offersMap.querySelector('.map__filters-container');
offersMap.insertBefore(renderOffers(), offersInsertPoint);

/**
* Функция, создающая Document Fragment и заполняющая его разметкой пользовательских объявлений.
* Разметка каждого объявления основана на шаблоне <article class="map__card"> из списка <template>.
* Количество объявлений на выходе соответствует количеству объектов-объявлений в массиве offers[].
*
* @function renderOffers.
* @return {object} — Document Fragment с html разметкой.
*/
function renderOffers() {
  var offerTemplate = document.querySelector('template').content.querySelector('.map__card');
  var offersFragment = document.createDocumentFragment();

  for (var i = 0; i < offers.length; i++) {
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

    offer.className = 'map__card';
    avatar.src = offers[i].author.avatar;
    title.textContent = offers[i].offer.title;
    address.textContent = offers[i].offer.address;
    price.textContent = offers[i].offer.price + '\u20bd / ночь';
    type.textContent = decodePropertyType(offers[i].offer.type);
    capacity.textContent = offers[i].offer.rooms + ' комнаты для ' + offers[i].offer.guests + ' гостей';
    stayTime.textContent = 'Заезд после ' + offers[i].offer.checkin + ', выезд до ' + offers[i].offer.checkout;
    description.textContent = offers[i].offer.description;
    cleanupChildNodes(featuresList);
    featuresList.appendChild(createFeaturesMarkup(offers[i].offer.features));

    offersFragment.appendChild(offer);
  }

  return offersFragment;
}

/**
* Функция, расшифровывающая представление элемента по базе в понятное обозначение на русском языке.
*
* @function decodePropertyType.
* @param {string} externalKey — на вход принимается значение для расшифровки.
* @return {string} — конвертированное значение.
*/
function decodePropertyType(externalKey) {
  var base = offerPropertyTypes;
  var baseLength = offerPropertyTypes.length;
  var requestedDescription = 'Тип недвижимости не определен';

  for (var i = 0; i < baseLength; i++) {
    if (base[i].indexOf(externalKey) >= 0) {
      requestedDescription = base[i][1];
      break;
    }
  }

  return requestedDescription;
}

/**
* Функция, удаляющая все дочерние элементы (теги) заданного DOM узла.
*
* @function cleanupChildNodes.
* @param {object} parentNode — родительский узел для очистки.
*/
function cleanupChildNodes(parentNode) {
  var childNodes = parentNode.querySelectorAll('*');

  for (var i = 0; i < childNodes.length; i++) {
    parentNode.removeChild(childNodes[i]);
  }
}

/**
* Функция, создающая на основе массива преимуществ соответствующую HTML разметку.
*
* @param {array} externalArray — входной массив со списком преимуществ.
* @return {object} — фрагмент с готовой HTML разметкой.
*/
function createFeaturesMarkup(externalArray) {
  var arrayLength = externalArray.length;
  var featuresFragment = document.createDocumentFragment();

  for (var i = 0; i < arrayLength; i++) {
    var featureTag = document.createElement('li');
    featureTag.className = 'feature  feature--' + externalArray[i];

    featuresFragment.appendChild(featureTag);
  }

  return featuresFragment;
}
