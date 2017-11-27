'use strict';

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
var offerTypes = [
  'flat',
  'house',
  'bungalo'
];

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

// Массив объектов, главный — Предложения по недвижимости (заполняется вызовом функции generateOffers())
var offers = [];
generateOffers(offers);

/**
* Главная функция, генерирующая во входном массиве 8 объектов с готовыми предложениями по недвижимости
* @function generateOffers
* @param {array} array — входной массив для заполнения объектами
*/
function generateOffers(array) {
  var uniqueAvatars = generateUniqueIntegersArray(1, 8, 8);
  var uniqueTitles = generateUniqueIntegersArray(0, 7, 8);

  for (var i = 0; i < 8; i++) {
    array[i] = {};
    array[i].author = {};
    array[i].author.avatar = 'img/avatars/user0' + uniqueAvatars[i] + '.png';
    array[i].offer = {};
    array[i].offer.title = offerTitles[uniqueTitles[i]];
    array[i].offer.price = getRandomInteger(1000, 1000000);
    array[i].offer.type = offerTypes[getRandomInteger(0, offerTypes.length - 1)];
    array[i].offer.rooms = getRandomInteger(1, 5);
    array[i].offer.guests = getRandomInteger(0, 200);
    array[i].offer.checkin = offerTimes[getRandomInteger(0, offerTimes.length - 1)];
    array[i].offer.checkout = offerTimes[getRandomInteger(0, offerTimes.length - 1)];
    array[i].offer.features = generateUniqueCollection(offerFeatures);
    array[i].offer.description = '';
    array[i].offer.photos = [];
    array[i].location = {};
    array[i].location.x = getRandomInteger(300, 900);
    array[i].location.y = getRandomInteger(100, 500);
    array[i].offer.address = array[i].location.x + ', ' + array[i].location.y;
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
* Функция, генерирующая массив уникальных целых чисел в заданном диапазоне и заданной длины
* @function generateUniqueIntegersArray
* @param {number} min — минимально допустимое число
* @param {number} max — максимально допустимое число
* @param {number} expectedLength — желаемая длина выходного массива
* @return {array} numbers — массив уникальных чисел
*/
function generateUniqueIntegersArray(min, max, expectedLength) {
  var numbers = [];
  var swap = 0;
  var i = 0;

  while (i < expectedLength) {
    swap = getRandomInteger(min, max);

    if (numbers.indexOf(swap) === -1) {
      numbers.push(swap);
      i++;
    } else {
      continue;
    }
  }

  return numbers;
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
