'use strict';

/*
***********************************************************************************
***********************************************************************************
***
***              БИБЛИОТЕКИ ДАННЫХ (ОБЪЕКТЫ, МАССИВЫ, КОНСТАНТЫ)
***
***********************************************************************************
***********************************************************************************
*/

// Массив — Заголовки предложений
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

// Массив — Типы жилья
// var offerTypes = [
//   'flat',
//   'house',
//   'bungalo'
// ];

var offerTypes = {
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};

// Массив — Время checkin и checkout
var offerTimes = [
  '12:00',
  '13:00',
  '14:00'
];

// Массив — Преимущества жилья
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

// Создание главного массива объявлений и заполнение его объектами данных
var offers = [];
generateOffers(8, offers);

/**
* Функция, генерирующая во входном массиве объекты с готовыми предложениями по недвижимости
* @function generateOffers
* @param {number} expectedNumber — необходимое количество конечных объектов
* @param {array} array — входной массив для заполнения объектами
*/
function generateOffers(expectedNumber, array) {
  for (var i = 0; i < expectedNumber; i++) {
    var avatarSerial = i + 1;
    var swapLocationX = getRandomInteger(300, 900);
    var swapLocationY = getRandomInteger(100, 500);

    array[i] = {
      author: {
        avatar: 'img/avatars/user0' + avatarSerial + '.png'
      },

      offer: {
        title: offerTitles[i],
        price: getRandomInteger(1000, 1000000),
        type: getRandomElementFromArray(offerTypes),
        rooms: getRandomInteger(1, 5),
        guests: getRandomInteger(0, 200),
        checkin: getRandomElementFromArray(offerTimes),
        checkout: getRandomElementFromArray(offerTimes),
        features: generateUniqueCollection(offerFeatures),
        description: '',
        photos: [],
        address: swapLocationX + ', ' + swapLocationY
      },

      location: {
        x: swapLocationX,
        y: swapLocationY
      }
    };
  }
}

/**
* Функция, генерирующая случайное целое число в указанном диапазоне (min и max участвуют)
* @function getRandomInteger
* @param {number} min — минимально допустимое число
* @param {number} max — максимально допустимое число
* @return {number} — искомое случайное число
*/
function getRandomInteger(min, max) {
  var result = min + Math.random() * (max + 1 - min);
  result = Math.floor(result);
  return result;
}

/**
* Функция, выдающая значение рандомного элемента из входного массива
* @function getRandomElementFromArray
* @param {arrya} array — входной массив с данными
* @return {string} requiredElement — искомый рандомный элемент
*/
function getRandomElementFromArray(array) {
  var maxIndex = array.length - 1;
  var randomIndex = getRandomInteger(0, maxIndex);
  var requiredElement = array[randomIndex];

  return requiredElement;
}

/**
* Функция, генерирующая уникальный новый набор элементов на основе вариантов из входного массива (например, offerFeatures)
* @function generateUniqueCollection
* @param {array} array — входной массив с вариантами для перекомпоновки
* @return {array} uniqueCollection — новая подборка уникальных элементов случайной длины
*/
function generateUniqueCollection(array) {
  var maxNumber = array.length - 1;
  var collectionLength = getRandomInteger(1, maxNumber);
  var uniqueIndexes = generateUniqueIntegersArray(0, maxNumber, collectionLength);
  var uniqueCollection = [];

  for (var i = 0; i < collectionLength; i++) {
    uniqueCollection.push(array[uniqueIndexes[i]]);
  }

  return uniqueCollection;
}

/**
* Функция, генерирующая массив уникальных целых чисел в заданном диапазоне и заданной длины
* @function generateUniqueIntegersArray
* @param {number} min — минимально допустимое число
* @param {number} max — максимально допустимое число
* @param {number} expectedLength — желаемая длина выходного массива
* @return {array} uniqueArray — массив уникальных чисел
*/
function generateUniqueIntegersArray(min, max, expectedLength) {
  var uniqueArray = [];
  var swap = 0;
  var i = 0;

  while (i < expectedLength) {
    swap = getRandomInteger(min, max);

    if (uniqueArray.indexOf(swap) === -1) {
      uniqueArray.push(swap);
      i++;
    } else {
      continue;
    }
  }

  return uniqueArray;
}

/**
* Функция, конвертирующая представление элемента по базе в более понятное обозначение на русском языке
* @function convertTypeToExplanation
* @param {string} key — на вход принимается элемент для расшифровки
* @return {string} explanation — конвертированное значение
*/
function convertTypeToExplanation(key) {
  var explanation = 'Квартира';

  switch (key) {
    case 'flat':
      explanation = 'Квартира';
      break;
    case 'house':
      explanation = 'Дом';
      break;
    case 'bungalo':
      explanation = 'Бунгало';
      break;
  }

  return explanation;
}


/*
***********************************************************************************
***********************************************************************************
***
***              СОЗДАНИЕ НЕОБХОДИМОЙ HTML РАЗМЕТКИ ДЛЯ ОБЪЯВЛЕНИЙ
***
***********************************************************************************
***********************************************************************************
*/

// Получение и отображение на сайте карты с пользовательскими пинами
var map = document.querySelector('.map');
map.classList.remove('map--faded');

// Создание фрагмента документа и заполнение его разметкой по шаблону
// Данный фрагмент создает на карте пины (<button><img></button>)
var pinsContainer = map.querySelector('.map__pins');
var pinsFragment = document.createDocumentFragment();

for (var j = 0; j < offers.length; j++) {
  var pin = document.createElement('button');
  pin.className = 'map__pin';
  var pinShiftX = 23; // смещение пина по X с учетом его размеров (в px)
  var pinShiftY = 62; // смещение пина по Y с учетом его размеров (в px)
  pin.style.left = offers[j].location.x + pinShiftX + 'px';
  pin.style.top = offers[j].location.y + pinShiftY + 'px';

  var img = document.createElement('img');
  img.src = offers[j].author.avatar;
  img.width = 40;
  img.height = 40;
  img.draggable = false;

  pin.appendChild(img);
  pinsFragment.appendChild(pin);
}

pinsContainer.appendChild(pinsFragment);


// Получение шаблона объявлений и заполнение его данными из объектов offers[ {}..{}..{} ]
var offerTemplate = document.querySelector('template').content.querySelector('.map__card');
var offersFragment = document.createDocumentFragment();

for (var k = 0; k < offers.length; k++) {
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
  avatar.src = offers[k].author.avatar;
  title.textContent = offers[k].offer.title;
  address.textContent = offers[k].offer.address;
  price.innerHTML = offers[k].offer.price + '&#x20bd;/ночь';
  type.textContent = convertTypeToExplanation(offers[k].offer.type);
  capacity.textContent = offers[k].offer.rooms + ' комнаты для ' + offers[k].offer.guests + ' гостей';
  stayTime.textContent = 'Заезд после ' + offers[k].offer.checkin + ', выезд до ' + offers[k].offer.checkout;
  description.textContent = offers[k].offer.description;
  cleanupChildNodes(featuresList);
  featuresList.appendChild(createFeaturesMarkup(offers[k].offer.features));

  offersFragment.appendChild(offer);
}

var insertPoint = map.querySelector('.map__filters-container');
map.insertBefore(offersFragment, insertPoint);


/**
* Функция, удаляющая все дочерние элементы (теги) заданного родительского узла
* @function cleanupChildNodes
* @param {object} parentNode — родительский узел для очистки
*/
function cleanupChildNodes(parentNode) {
  var childNodes = parentNode.querySelectorAll('*');

  for (var i = 0; i < childNodes.length; i++) {
    parentNode.removeChild(childNodes[i]);
  }
}

/**
* Функция, создающая на основе массива преимуществ (offers[i].offer.features) соответствующую HTML разметку
* @param {array} array — входной массив со списком преимуществ
* @return {object} featuresFragment — фрагмент с готовой HTML разметкой
*/
function createFeaturesMarkup(array) {
  var arrayLength = array.length;
  var featuresFragment = document.createDocumentFragment();

  for (var i = 0; i < arrayLength; i++) {
    var featureTag = document.createElement('li');
    featureTag.className = 'feature';

    switch (array[i]) {
      case 'wifi':
        featureTag.classList.add('feature--wifi');
        break;
      case 'dishwasher':
        featureTag.classList.add('feature--dishwasher');
        break;
      case 'parking':
        featureTag.classList.add('feature--parking');
        break;
      case 'washer':
        featureTag.classList.add('feature--washer');
        break;
      case 'elevator':
        featureTag.classList.add('feature--elevator');
        break;
      case 'conditioner':
        featureTag.classList.add('feature--conditioner');
        break;
    }

    featuresFragment.appendChild(featureTag);
  }

  return featuresFragment;
}
