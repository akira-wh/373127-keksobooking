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

// Сложный массив — Типы жилья
var offerPropertyTypes = [
  ['flat', 'Квартира'],
  ['house', 'Дом'],
  ['bungalo', 'Бунгало']
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
* Функция, заполняющая входной массив объектами-объявлениями по недвижимости
*
* @function generateOffers
* @param {number} expectedNumber — необходимое количество конечных объектов
* @param {array} array — входной массив для заполнения объектами
*/
function generateOffers(expectedNumber, array) {
  for (var i = 0; i < expectedNumber; i++) {
    var avatarSerial = i + 1;
    var swapLocationX = getRandomInteger(300, 900);
    var swapLocationY = getRandomInteger(100, 500);
    var currentTitle = offerTitles[i];

    array[i] = {
      author: {
        avatar: 'img/avatars/user0' + avatarSerial + '.png'
      },

      offer: {
        title: offerTitles[i],
        price: getRandomInteger(1000, 1000000),
        type: determineRightPropertyType(currentTitle),
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
*
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
* Функция, выбирающая из входного массива рандомный элемент и отдающая его значение
*
* @function getRandomElementFromArray
* @param {arrya} array — входной массив
* @return {string} requiredElement — значение рандомного элемента
*/
function getRandomElementFromArray(array) {
  var maxIndex = array.length - 1;
  var randomIndex = getRandomInteger(0, maxIndex);
  var requiredElement = array[randomIndex];

  return requiredElement;
}

/**
* Функция, которая определяет по заголовку объявления соответствующий ему тип недвижимости.
*
* @function determineRightPropertyType
* @param {string} workingTitle — входной заголовок объявления
* @return {string} requiredValue — определенный тип недвижимости
*/
function determineRightPropertyType(workingTitle) {
  var types = offerPropertyTypes;
  var flat = 0;
  var house = 1;
  var bungalo = 2;

  if (workingTitle.indexOf('квартира') >= 0) {
    var requiredValue = types[flat][0];
  } else if (workingTitle.indexOf('дворец') >= 0 || workingTitle.indexOf('домик') >= 0) {
    requiredValue = types[house][0];
  } else if (workingTitle.indexOf('бунгало') >= 0) {
    requiredValue = types[bungalo][0];
  } else {
    requiredValue = 'Тип недвижимости неизвестен';
  }

  return requiredValue;
}

/**
* Функция, создающая новый набор элементов на основе вариантов из входного массива.
* Элементы не повторяются, а их количество не превышает объем входного массива.
* 1. Узнаем пороговую длину входного массива
* 2. Генерируем длину новой коллекции (не менее 1 элемента, не более длины входного массива)
* 3. Создаем временно пустую коллекцию
* 4. Рандомно выбираем из входного массива элементы для новой коллекции
* 5. Копируем выбранные элементы
* 6. Отдаем подборку
*
* @function generateUniqueCollection
* @param {array} array — входной массив с вариантами для перекомпоновки
* @return {array} collection — новая подборка
*/
function generateUniqueCollection(array) {
  var maxLength = array.length - 1;
  var newCollectionLength = getRandomInteger(1, maxLength);
  var collection = [];
  var selectedElements = getNonrepeatingIntegers(0, maxLength, newCollectionLength);

  for (var i = 0; i < newCollectionLength; i++) {
    collection.push(array[selectedElements[i]]);
  }

  return collection;
}

/**
* Функция, генерирующая массив неповторяющихся целых чисел в заданном диапазоне и заданной длины
*
* @function getNonrepeatingIntegers
* @param {number} min — минимально допустимое число
* @param {number} max — максимально допустимое число
* @param {number} expectedLength — ожидаемая длина выходного массива
* @return {array} array — массив рандомных неповторяющихся чисел
*/
function getNonrepeatingIntegers(min, max, expectedLength) {
  var array = [];
  var i = 0;
  var unique = -1;

  while (i < expectedLength) {
    var newNumber = getRandomInteger(min, max);

    if (array.indexOf(newNumber) === unique) {
      array.push(newNumber);
      i++;
    } else {
      continue;
    }
  }

  return array;
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
* Функция, конвертирующая представление элемента по базе в более понятное обозначение на русском языке
*
* @function convertTypeToExplanation
* @param {string} key — на вход принимается элемент для расшифровки
* @return {string} explanation — конвертированное значение
*/
function convertTypeToExplanation(key) {
  switch (key) {
    case 'flat':
      var explanation = 'Квартира';
      break;
    case 'house':
      explanation = 'Дом';
      break;
    case 'bungalo':
      explanation = 'Бунгало';
      break;
    default:
      explanation = 'Тип недвижимости неопределен';
      break;
  }

  return explanation;
}

/**
* Функция, удаляющая все дочерние элементы (теги) заданного родительского узла
*
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
*
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
