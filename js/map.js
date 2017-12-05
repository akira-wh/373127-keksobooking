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

// Константы
var ENTER_KEYCODE = 13;

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
***                       ГЕНЕРАЦИЯ ОБЪЕКТОВ-ОБЪЯВЛЕНИЙ В МАССИВ
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
* @function generateOffers
* @param {number} expectedNumber — необходимое количество конечных объектов
* @param {array} targetArray — входной массив для заполнения объектами
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
* @function getRandomInteger
* @param {number} minValue — минимально допустимое число
* @param {number} maxValue — максимально допустимое число
* @return {number} — искомое случайное число
*/
function getRandomInteger(minValue, maxValue) {
  var randomInteger = minValue + Math.random() * (maxValue + 1 - minValue);
  randomInteger = Math.floor(randomInteger);

  return randomInteger;
}

/**
* Функция, выбирающая из входного массива рандомный элемент и возвращающая его значение.
*
* @function getRandomElementFromArray
* @param {array} externalArray — входной массив с элементами на выбор
* @return {string} — значение рандомного элемента
*/
function getRandomElementFromArray(externalArray) {
  var maxIndex = externalArray.length - 1;
  var randomIndex = getRandomInteger(0, maxIndex);
  var requestedElement = externalArray[randomIndex];

  return requestedElement;
}

/**
* Функция, которая определяет по заголовку объявления соответствующий ему тип недвижимости.
*
* @function determineRightPropertyType
* @param {string} workingTitle — входной заголовок объявления
* @return {string} — определенный тип недвижимости
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
* @function generateUniqueCollection
* @param {array} externalArray — входной массив с вариантами для перекомпоновки
* @return {array} — новая подборка
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
* @function getNonrepeatingIntegers
* @param {number} minValue — минимально допустимое число
* @param {number} maxValue — максимально допустимое число
* @param {number} expectedLength — ожидаемая длина выходного массива
* @return {array} — массив рандомных неповторяющихся чисел
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
***       ОСНОВНОЙ ФУНКЦИОНАЛ ПОРТАЛА: АКТИВАЦИЯ ПОЛЬЗОВАТЕЛЬСКИХ СЕРВИСОВ
***
***********************************************************************************
***********************************************************************************
*/

// Получение карты объявлений и пинов.
var map = document.querySelector('.map');

// Получение контейнера пинов.
var pinArea = document.querySelector('.map__pins');

// Получение управляющего пользовательского пина.
var userPin = document.querySelector('.map__pin--main');

// Получение формы создания объявлений.
var userForm = document.querySelector('.notice__form');

// Отлов первого клика или первого нажатия ENTER по управляющему пину.
// Запуск основного функционала сайта.
userPin.addEventListener('mouseup', onUserPinFirstClick);
userPin.addEventListener('keydown', onUserPinFirstEnterPress);

/**
* Обработчик, активирующий основной функционал сайта по первому клику на управлящем ине.
* Активирует карту, форму создания объявлений и отрисовывает пины.
* Удаляет альтернативный отлов того же события (onUserFirstEnterPress) и самого себя после отработки.
*
* @function onUserPinFirstClick
*/
function onUserPinFirstClick() {
  activateMap();
  activateUserForm();
  renderPins();
  pinArea.addEventListener('click', onPinClick);
  userPin.removeEventListener('keydown', onUserPinFirstEnterPress);
  userPin.removeEventListener('mouseup', onUserPinFirstClick);
}

/**
* Обработчик, активирующий основной функционал сайта по первому нажатию ENTER на управляющем пине.
* Активирует карту, форму создания объявлений и отрисовывает пины.
* Удаляет альтернативный отлов того же события (onUserPinFirstClick) и самого себя после отработки.
*
* @function onUserPinFirstEnterPress
* @param {object} evt — объект события
*/
function onUserPinFirstEnterPress(evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    activateMap();
    activateUserForm();
    renderPins();
    pinArea.addEventListener('click', onPinClick);
    userPin.removeEventListener('mouseup', onUserPinFirstClick);
    userPin.removeEventListener('keydown', onUserPinFirstEnterPress);
  }
}

/**
* Функция, активирующая карту пинов и объявлений.
* Активация происходит за счет снятия у соответствующего <section> блокирующего класса .map--faded.
*
* @function activateMap
*/
function activateMap() {
  map.classList.remove('map--faded');
}

/**
* Функция, активирующая форму создания объявлений.
* Активация происходит за счет снятия у <form> блокирующего класса .notice__form--disabled,
* а также получения и снятия у внутренних <fieldset> блокирующего атрибута disabled.
*
* @function activateUserForm
*/
function activateUserForm() {
  userForm.classList.remove('notice__form--disabled');

  var fieldsets = userForm.querySelectorAll('fieldset');
  var fieldsetsNumber = fieldsets.length - 1;

  for (var i = 0; i < fieldsetsNumber; i++) {
    fieldsets[i].disabled = false;
  }
}

/**
* Обработчик, отрисовывающий рядом с выбранным пином соответствующее ему объявление.
* Выбранный пин определяется проверкой на всплытии, объявление — по соответствующему индексу пина.
*
* @function onPinClick
* @param {object} evt — объект события
*/
function onPinClick(evt) {
  var pins = document.querySelectorAll('.map__pins button:not(.map__pin--main)');
  var pinsNumber = pins.length;
  var target = evt.target;

  while (target !== pinArea) {

    if (target.className === 'map__pin') {
      for (var i = 0; i < pinsNumber; i++) {
        if (pins[i] === target) {
          var equivalentIndex = i;
          removeUselessOffer();
          renderRequestedOffer(equivalentIndex);
          return;
        }
      }
    } else {
      target = target.parentNode;
    }

  }
}

/**
* Функция, удаляющая popup с ненужным объявлением.
*
* @function removeUselessOffer
*/
function removeUselessOffer() {
  var uselessOffer = map.querySelector('.map__card.popup');

  if (uselessOffer) {
    uselessOffer.parentNode.removeChild(uselessOffer);
  }
}

/*
***********************************************************************************
***********************************************************************************
***
***                   СОЗДАНИЕ РАЗМЕТКИ + ОТРИСОВКА НА КАРТЕ ПИНОВ
***
***********************************************************************************
***********************************************************************************
*/

/**
* Функция создания и отрисовки пользовательских пинов.
* Создает Document Fragment, заполняет разметкой и внедряет на страницу.
* Информационная составляющая снимается с объектов-объявлений массива offers[].
* Разметка каждого пина основана на шаблоне <button class="map__pin"> из списка <template>.
* Количество пинов на выходе соответствует количеству объектов-объявлений offers[].
*
* @function renderPins
*/
function renderPins() {
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var pinsFragment = document.createDocumentFragment();
  var pinsNumber = offers.length;

  for (var i = 0; i < pinsNumber; i++) {
    var pin = pinTemplate.cloneNode(true);
    var img = pin.querySelector('img');
    var pinShiftX = 5; // смещение пина по X с учетом его размеров (в px).
    var pinShiftY = 37; // смещение пина по Y с учетом его размеров (в px).

    pin.style.left = offers[i].location.x - pinShiftX + 'px';
    pin.style.top = offers[i].location.y - pinShiftY + 'px';
    img.src = offers[i].author.avatar;

    pinsFragment.appendChild(pin);
  }

  pinArea.appendChild(pinsFragment);
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

/**
* Функция создания и отрисовки необходимого объявления.
* Создает Document Fragment, заполняет разметкой и внедряет на страницу.
* Информационная составляющая снимается с объектов-объявлений массива offers[].
* Разметка основывается на шаблоне <article class="map__card"> из списка <template>.
*
* @function renderRequestedOffer
* @param {number} index — индекс необходимого объявления из массива
*/
function renderRequestedOffer(index) {
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

  avatar.src = offers[index].author.avatar;
  title.textContent = offers[index].offer.title;
  address.textContent = offers[index].offer.address;
  price.textContent = offers[index].offer.price + '\u20bd / ночь';
  type.textContent = decodePropertyType(offers[index].offer.type);
  capacity.textContent = offers[index].offer.rooms + ' комнаты для ' + offers[index].offer.guests + ' гостей';
  stayTime.textContent = 'Заезд после ' + offers[index].offer.checkin + ', выезд до ' + offers[index].offer.checkout;
  description.textContent = offers[index].offer.description;
  featuresList.innerHTML = '';
  featuresList.appendChild(createFeaturesMarkup(offers[index].offer.features));

  offerFragment.appendChild(offer);

  var offerInsertPoint = map.querySelector('.map__filters-container');
  map.insertBefore(offerFragment, offerInsertPoint);
}

/**
* Функция, расшифровывающая представление элемента по базе в понятное обозначение на русском языке.
*
* @function decodePropertyType
* @param {string} externalKey — на вход принимается значение для расшифровки
* @return {string} — конвертированное значение
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
* Функция, создающая на основе массива преимуществ соответствующую HTML разметку.
*
* @param {array} externalArray — входной массив со списком преимуществ
* @return {object} — фрагмент с готовой HTML разметкой
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
