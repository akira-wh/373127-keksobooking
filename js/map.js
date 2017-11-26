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

// Массив — Предложения по недвижимости (заполняется объектами вызовом функции generateOffers())
var offers = [];
generateOffers(offers);


/**
* Функция, генерирующая во входном массиве 8 объектов с готовыми предложениями по недвижимости
* @function generateOffers
* @param {array} array — входной массив для заполнения объектами
*/
function generateOffers(array) {
  var temporaryAvatars = generateUniqueIntegersArray(1, 8, 8);
  var temporaryTitles = generateUniqueIntegersArray(0, 7, 8);

  for (var i = 0; i < 8; i++) {
    array[i] = {};
    array[i].author = {};
    array[i].author.avatar = 'img/avatars/user{{0' + temporaryAvatars[i] + '}}.png';
    array[i].offer = {};
    array[i].offer.title = offerTitles[temporaryTitles[i]];
    array[i].offer.price = getRandomInteger(1000, 1000000);
    array[i].offer.type = offerTypes[getRandomInteger(0, offerTypes.length - 1)];
    array[i].offer.rooms = getRandomInteger(1, 5);
    array[i].offer.guests = getRandomInteger(0, 200);
    array[i].offer.checkin = offerTimes[getRandomInteger(0, offerTimes.length - 1)];
    array[i].offer.checkout = offerTimes[getRandomInteger(0, offerTimes.length - 1)];
    array[i].offer.features = generateFeaturesCollection(offerFeatures);
    array[i].offer.description = '';
    array[i].offer.photos = [];
    array[i].location = {};
    array[i].location.x = getRandomInteger(300, 900);
    array[i].location.y = getRandomInteger(100, 500);
    array[i].offer.address = '{{' + array[i].location.x + '}}, {{' + array[i].location.y + '}}';
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
  var count = 0;

  while (count < expectedLength) {
    swap = getRandomInteger(min, max);

    if (numbers.indexOf(swap) === -1) {
      numbers.push(swap);
      count++;
    } else {
      continue;
    }
  }

  return numbers;
}

/**
* Функция, генерирующая случайный набор уникальных преимуществ на основе вариантов из входного массива (offerFeatures)
* @function generateFeaturesCollection
* @param {array} array — входной массив с вариантами для компоновки
* @return {array} featuresCollection — искомая подборка уникальных преимуществ случайной длины
*/
function generateFeaturesCollection(array) {
  var maxNumber = array.length - 1;
  var collectionLength = getRandomInteger(1, maxNumber);
  var uniqueIndexes = generateUniqueIntegersArray(0, maxNumber, collectionLength);
  var featuresCollection = [];

  for (var i = 0; i < collectionLength; i++) {
    featuresCollection.push(array[uniqueIndexes[i]]);
  }

  return featuresCollection;
}
