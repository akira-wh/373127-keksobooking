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
var ESC_KEYCODE = 27;

// Массив — Заголовки предложений.
var offersTitles = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

// Объект — Типы жилья (ключи и расшифровки).
var offersPropertyTypes = {
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};

// Массив — Время checkin и checkout.
var offersTimes = [
  '12:00',
  '13:00',
  '14:00'
];

// Массив — Преимущества жилья.
var offersFeatures = [
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

// Создание и заполнение главного массива объявлений.
var offers = generateOffers(8);

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
    var avatarSerial = i + 1;
    var selectedLocationX = getRandomInteger(300, 900);
    var selectedLocationY = getRandomInteger(100, 500);
    var selectedTitle = offersTitles[i];

    requestedOffers[i] = {
      author: {
        avatar: 'img/avatars/user0' + avatarSerial + '.png'
      },

      offer: {
        title: selectedTitle,
        price: getRandomInteger(1000, 1000000),
        type: determineRightPropertyType(selectedTitle),
        rooms: getRandomInteger(1, 5),
        guests: getRandomInteger(0, 20),
        checkin: getRandomElementFromArray(offersTimes),
        checkout: getRandomElementFromArray(offersTimes),
        features: generateUniqueCollection(offersFeatures),
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
* Генерация случайного числа в указанном диапазоне (minValue и maxValue участвуют).
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
* Выбор из входного массива рандомного элемента и возвращение его значения.
*
* @function getRandomElementFromArray
* @param {array} sourceElements — входной массив с элементами на выбор
* @return {string} — значение рандомного элемента
*/
function getRandomElementFromArray(sourceElements) {
  var maxIndex = sourceElements.length - 1;
  var randomIndex = getRandomInteger(0, maxIndex);
  var requestedElement = sourceElements[randomIndex];

  return requestedElement;
}

/**
* Определение по заголовку объявления соответствующий ему тип недвижимости.
* Работа с keywords: '..квартира..' -> flat; '..бунгало..' -> bungalo; '..дом..' -> house;
*
* @function determineRightPropertyType
* @param {string} title — входной заголовок объявления
* @return {string} — тип недвижимости, подходящий заголовку объявления
*/
function determineRightPropertyType(title) {
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

/**
* Создание нового набора элементов на основе вариантов из входного массива.
* Элементы не повторяются, а их количество не превышает объем входного массива.
* 1. Узнаем пороговую длину входного массива.
* 2. Генерируем длину новой коллекции (не менее 1 элемента, не более длины входного массива).
* 3. Создаем временно пустую коллекцию.
* 4. Рандомно выбираем из входного массива элементы для новой коллекции.
* 5. Копируем выбранные элементы.
* 6. Отдаем подборку.
*
* @function generateUniqueCollection
* @param {array} sourceElements — входной массив с вариантами для перекомпоновки
* @return {array} — новая подборка
*/
function generateUniqueCollection(sourceElements) {
  var maxValue = sourceElements.length - 1;
  var newCollectionLength = getRandomInteger(1, maxValue);
  var selectedElements = getNonrepeatingIntegers(0, maxValue, newCollectionLength);

  var requestedCollection = [];

  for (var i = 0; i < newCollectionLength; i++) {
    requestedCollection.push(sourceElements[selectedElements[i]]);
  }

  return requestedCollection;
}

/**
* Генерация массива неповторяющихся целых чисел в заданном диапазоне и заданной длины.
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
  var uniqueNumber = -1;

  while (i < expectedLength) {
    var newNumber = getRandomInteger(minValue, maxValue);

    if (nonrepeatingIntegers.indexOf(newNumber) === uniqueNumber) {
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
***   ОСНОВНОЙ ФУНКЦИОНАЛ ПОРТАЛА: АКТИВАЦИЯ И РАБОТА ПОЛЬЗОВАТЕЛЬСКИХ СЕРВИСОВ
***
***********************************************************************************
***********************************************************************************
*/

// Получение управляющего пользовательского пина.
// Отлов первого взаимодействия с ним -> запуск основного функционала сайта.
var controlPin = document.querySelector('.map__pin--main');

controlPin.addEventListener('mouseup', onControlPinFirstClick);
controlPin.addEventListener('keydown', onControlPinFirstEnterPress);

/**
* Активация основного функционала сайта.
* Вызывается по первому КЛИКУ на управлящем пине.
*
* @function onControlPinFirstClick
*/
function onControlPinFirstClick() {
  activateServices();
}

/**
* Активация основного функционала сайта.
* Вызывается по первому нажатию ENTER на управлящем пине.
*
* @function onControlPinFirstEnterPress
* @param {object} evt — объект события
*/
function onControlPinFirstEnterPress(evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    activateServices();
  }
}

/**
* Активация основных пользовательских сервисов:
* 1. Запускаются карта и форма создания объявлений,
* 2. Отрисовываются пины,
* 3. Начинается отлов переключения пинов/объявлений,
* 4. Исключается возможность запустить себя как функцию повторно.
*
* @function activateServices
*/
function activateServices() {
  activateMap();
  activateUserForm();
  renderPins(8, offers);

  var pinArea = document.querySelector('.map__pins');
  pinArea.addEventListener('click', onPinClick);

  // Спорное место (зависимость от глобальной переменной controlPin).
  controlPin.removeEventListener('keydown', onControlPinFirstEnterPress);
  controlPin.removeEventListener('mouseup', onControlPinFirstClick);
}

/**
* Активация пинов и объявлений.
* Активация происходит за счет снятия у соответствующего <section> блокирующего класса .map--faded.
*
* @function activateMap
*/
function activateMap() {
  var map = document.querySelector('.map');
  map.classList.remove('map--faded');
}

/**
* Активация формы создания объявлений.
* Активация происходит за счет снятия у <form> блокирующего класса .notice__form--disabled, а также
* получения и снятия у внутренних <fieldset> блокирующего атрибута disabled.
*
* @function activateUserForm
*/
function activateUserForm() {
  var userForm = document.querySelector('.notice__form');
  var fieldsets = userForm.querySelectorAll('fieldset');
  var fieldsetsNumber = fieldsets.length;

  userForm.classList.remove('notice__form--disabled');

  for (var i = 0; i < fieldsetsNumber; i++) {
    fieldsets[i].disabled = false;
  }
}

/**
* Отрисовка рядом с выбранным пином соответствующего ему объявления.
* Проверка на всплытии.
* Индекс пина соответствует индексу объявления.
*
* @function onPinClick
* @param {object} evt — объект события
*/
function onPinClick(evt) {
  var pinArea = document.querySelector('.map__pins');
  var pins = pinArea.querySelectorAll('button:not(.map__pin--main)');
  var pinsNumber = pins.length;
  var target = evt.target;

  // Проверка на то, что вызванный элемент — пин.
  // Проверка идет от самых глубоких элементов наверх, пока evt.target не всплывет до currentTarget
  while (target !== pinArea) {

    // Если target — искомый пин...
    if (target.className === 'map__pin') {

      // Определяется его порядковый индекс (индекс в массиве пинов).
      // Когда индекс установлен — вызывается соответствующее этому индексу объявление (старое удаляется).
      for (var i = 0; i < pinsNumber; i++) {
        if (pins[i] === target) {

          removeUselessOffer();

          var referenceIndex = i;
          renderNewOffer(offers, referenceIndex);
          setPinActivityModifier(target);

          // Здесь регистрируется отлов событий для закрытия объявления.
          var offerCloseButton = document.querySelector('.popup .popup__close');
          offerCloseButton.addEventListener('click', onOfferCloseButtonPress);
          window.addEventListener('keydown', onOfferEscPress);

          return;
        }
      }
    } else {
      // Если target НЕ искомый элемент — проверяется родительский узел.
      target = target.parentNode;
    }

  }

  return;
}

/**
* Удаление ненужного объявления, отлова его событий,
* а также модификатора активности у соответствующего пина.
* Вызывается нажатием на кнопку ЗАКРЫТЬ в открытом объявлении.
*
* @function onOfferCloseButtonPress
*/
function onOfferCloseButtonPress() {
  removeUselessOffer();
}

/**
* Удаление ненужного объявления, отлова его событий,
* а также модификатора активности у соответствующего пина.
* Вызывается нажатием на ESC при открытом объявлении.
*
* @function onOfferEscPress
* @param {object} evt — объект события
*/
function onOfferEscPress(evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    removeUselessOffer();
  }
}

/**
* Удаление ненужного объявления, отлова его событий,
* а также модификатора активности у соответствующего пина.
*
* @function removeUselessOffer
*/
function removeUselessOffer() {
  var uselessOffer = document.querySelector('.popup');
  var uselessActivePin = document.querySelector('.map__pin--active');

  if (uselessOffer) {
    var uselessOfferCloseButton = uselessOffer.querySelector('.popup__close');

    uselessOfferCloseButton.removeEventListener('click', onOfferCloseButtonPress);
    window.removeEventListener('keydown', onOfferEscPress);

    uselessOffer.parentNode.removeChild(uselessOffer);
  }

  if (uselessActivePin) {
    uselessActivePin.classList.remove('map__pin--active');
  }
}

/**
* Добавление необходимому пину класса-модификатора .map__pin--active.
* Применяется при переключение пинов.
*
* @function setPinActivityModifier
* @param {object} node — DOM элемент
*/
function setPinActivityModifier(node) {
  node.classList.add('map__pin--active');
}


/*
***********************************************************************************
***********************************************************************************
***
***                       РАЗМЕТКА + ОТРИСОВКА НА КАРТЕ ПИНОВ
***
***********************************************************************************
***********************************************************************************
*/

/**
* Создание и отрисовка пользовательских пинов.
* Создается Document Fragment, заполняется разметкой и внедряется на страницу.
* Информационная составляющая снимается с объектов-объявлений массива offers[].
* Разметка каждого пина основана на шаблоне <button class="map__pin"> из списка <template>.
* Количество пинов на выходе соответствует количеству объектов-объявлений offers[].
*
* @function renderPins
* @param {number} expectedNumber — необходимое число отрисованных пинов
* @param {array} sourceOffers — массив объектов-объявлений для снятия данных.
*/
function renderPins(expectedNumber, sourceOffers) {
  var pinArea = document.querySelector('.map__pins');
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var pinsFragment = document.createDocumentFragment();

  for (var i = 0; i < expectedNumber; i++) {
    var pin = pinTemplate.cloneNode(true);

    var img = pin.querySelector('img');
    var pinShiftX = 5; // смещение пина по X с учетом его размеров (в px).
    var pinShiftY = 37; // смещение пина по Y с учетом его размеров (в px).

    pin.style.left = sourceOffers[i].location.x - pinShiftX + 'px';
    pin.style.top = sourceOffers[i].location.y - pinShiftY + 'px';
    img.src = sourceOffers[i].author.avatar;

    pinsFragment.appendChild(pin);
  }

  pinArea.appendChild(pinsFragment);
}


/*
***********************************************************************************
***********************************************************************************
***
***               РАЗМЕТКА + ОТРИСОВКА НА КАРТЕ ВЫБРАННОГО ОБЪЯВЛЕНИЯ
***
***********************************************************************************
***********************************************************************************
*/

/**
* Создание и отрисовка необходимого объявления.
* Создается Document Fragment, заполняется разметкой и внедряется на страницу.
* Информационная составляющая снимается с объектов-объявлений массива offers[].
* Разметка основывается на шаблоне <article class="map__card"> из списка <template>.
*
* @function renderNewOffer
* @param {array} sourceOffers — входной массив с объявлениями для извлечения данных
* @param {number} index — индекс необходимого объявления
*/
function renderNewOffer(sourceOffers, index) {
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

  avatar.src = sourceOffers[index].author.avatar;
  title.textContent = sourceOffers[index].offer.title;
  address.textContent = sourceOffers[index].offer.address;
  price.textContent = sourceOffers[index].offer.price + '\u20bd / ночь';
  type.textContent = decodePropertyType(sourceOffers[index].offer.type, offersPropertyTypes);
  capacity.textContent = sourceOffers[index].offer.rooms + ' комнаты для ' + sourceOffers[index].offer.guests + ' гостей';
  stayTime.textContent = 'Заезд после ' + sourceOffers[index].offer.checkin + ', выезд до ' + sourceOffers[index].offer.checkout;
  description.textContent = sourceOffers[index].offer.description;
  featuresList.innerHTML = '';
  featuresList.appendChild(createFeaturesMarkup(sourceOffers[index].offer.features));

  offerFragment.appendChild(offer);

  var map = document.querySelector('.map');
  var offerInsertPoint = map.querySelector('.map__filters-container');
  map.insertBefore(offerFragment, offerInsertPoint);
}

/**
* Расшифровка типа недвижимости.
* Обозначения flat, house etc. русифицируются для выдачи клиентской стороне.
*
* @function decodePropertyType
* @param {string} currentType — на вход принимается ключ для расшифровки
* @param {object} sourceTypes — входной объект с библиотекой ключей/значений
* @return {string} — конвертированное значение
*/
function decodePropertyType(currentType, sourceTypes) {
  var requestedDefinition = 'Тип недвижимости не определен';

  for (var key in sourceTypes) {
    if (currentType === key) {
      requestedDefinition = sourceTypes[key];
      break;
    }
  }

  return requestedDefinition;
}

/**
* Создание на основе массива преимуществ соответствующей HTML разметки.
*
* @param {array} sourceFeatures — входной массив со списком преимуществ
* @return {object} — фрагмент с готовой HTML разметкой
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
