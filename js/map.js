'use strict';

/*
***********************************************************************************
***********************************************************************************
***
***                   ГЛОБАЛЬНЫЕ ОБЪЕКТЫ, МАССИВЫ, КОНСТАНТЫ
***
***********************************************************************************
***********************************************************************************
*/

// Константы
//
// Коды клавиш
var ESC_KEYCODE = 27;

// Управляющий пользовательский пин
var CONTROL_PIN = document.querySelector('.map__pin--main');

// Смещение всех пинов (кроме управляющего) по X и Y с учетом брака стилизации
var PIN_SHIFT_X = 5;
var PIN_SHIFT_Y = 37;

// Форма создания объявлений
var USER_FORM = document.querySelector('.notice__form');

// Карта пинов и объявлений
var MAP = document.querySelector('.map');

// Массив — Заголовки объявлений.
var OFFERS_TITLES = [
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
var OFFERS_PROPERTY_TYPES = {
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};

// Массив — Время checkin и checkout.
var OFFERS_TIMES = [
  '12:00',
  '13:00',
  '14:00'
];

// Массив — Преимущества жилья.
var OFFERS_FEATURES = [
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
***             ГЕНЕРАЦИЯ ОБЪЕКТОВ-ОБЪЯВЛЕНИЙ В ГЛАВНЫЙ МАССИВ offers[]
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
    var selectedTitle = OFFERS_TITLES[i];

    requestedOffers[i] = {
      author: {
        avatar: 'img/avatars/user0' + avatarSerial + '.png'
      },

      offer: {
        title: selectedTitle,
        price: getRandomInteger(1000, 1000000),
        type: determinePropertyType(selectedTitle),
        rooms: getRandomInteger(1, 5),
        guests: getRandomInteger(0, 20),
        checkin: getRandomElementFromArray(OFFERS_TIMES),
        checkout: getRandomElementFromArray(OFFERS_TIMES),
        features: generateUniqueCollection(OFFERS_FEATURES),
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
* Определение происходит по ключевым словам.
* #квартира -> flat etc.
*
* @function determinePropertyType
* @param {string} title — входной заголовок объявления
* @return {string} — тип недвижимости, подходящий заголовку объявления
*/
function determinePropertyType(title) {
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
  var uniqueIndex = -1;

  while (i < expectedLength) {
    var newNumber = getRandomInteger(minValue, maxValue);

    if (nonrepeatingIntegers.indexOf(newNumber) === uniqueIndex) {
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

/**
* Приведение формы создания объявлений к необходимомму состоянию по умолчанию.
* Имеется ввиду состояние на момент загрузки сайта.
*
* @function setUserFormDefaultState
*/
(function setUserFormDefaultState() {
  var fieldsets = USER_FORM.querySelectorAll('fieldset');
  var fieldsetsNumber = fieldsets.length;

  for (var i = 0; i < fieldsetsNumber; i++) {
    fieldsets[i].disabled = true;
  }

  var inputTitle = USER_FORM.querySelector('input#title');
  var inputAddress = USER_FORM.querySelector('input#address');
  var inputPrice = USER_FORM.querySelector('input#price');
  var selectCapacity = USER_FORM.querySelector('select#capacity');

  USER_FORM.action = 'https://js.dump.academy/keksobooking';

  inputTitle.minLength = '30';
  inputTitle.maxLength = '100';
  inputTitle.required = true;

  inputAddress.readOnly = true;

  inputPrice.placeholder = '1000';
  inputPrice.min = '0';
  inputPrice.max = '1000000';
  inputPrice.required = true;

  selectCapacity.selectedIndex = 2;
})();

// Отлов первого взаимодействия с управляющим пином -> запуск основного функционала сайта.
CONTROL_PIN.addEventListener('click', onControlPinFirstClick);

/**
* Активация основного функционала сайта.
* Вызывается по первому КЛИКУ, нажатию ENTER или SPACE на управлящем пине.
*
* @function onControlPinFirstClick
*/
function onControlPinFirstClick() {
  activateServices();
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

  var pinArea = MAP.querySelector('.map__pins');
  pinArea.addEventListener('click', onPinClick);

  CONTROL_PIN.removeEventListener('click', onControlPinFirstClick);
}

/**
* Активация пинов и объявлений.
* Активация происходит за счет снятия у соответствующего <section> блокирующего класса .map--faded.
*
* @function activateMap
*/
function activateMap() {
  MAP.classList.remove('map--faded');
}

/**
* Активация формы создания объявлений, синхронизация связанных <input> и <select>.
* Активация происходит за счет снятия у <form> блокирующего класса .notice__form--disabled, а также
* получения и снятия у внутренних <fieldset> блокирующего атрибута disabled.
* По синхронизации см.документацию syncFormTimes(), syncFormPropertyPrice() и syncFormPropertyCapacity().
*
* @function activateUserForm
*/
function activateUserForm() {
  var fieldsets = USER_FORM.querySelectorAll('fieldset');
  var fieldsetsNumber = fieldsets.length;

  USER_FORM.classList.remove('notice__form--disabled');

  for (var i = 0; i < fieldsetsNumber; i++) {
    fieldsets[i].disabled = false;
  }

  syncFormTimes();
  syncFormPropertyPrice();
  syncFormPropertyCapacity();
  watchFormValidity();
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
  var pinArea = MAP.querySelector('.map__pins');
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
          removeUselessPinActivityModifier();

          var referenceIndex = i;
          renderNewOffer(offers, referenceIndex);
          setPinActivityModifier(target);

          // Здесь регистрируется отлов событий для закрытия объявления.
          var offerCloseButton = MAP.querySelector('.popup .popup__close');
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
  removeUselessPinActivityModifier();
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
    removeUselessPinActivityModifier();
  }
}

/**
* Удаление ненужного объявления и отлова его событий.
*
* @function removeUselessOffer
*/
function removeUselessOffer() {
  var uselessOffer = MAP.querySelector('.popup');

  if (uselessOffer) {
    var uselessOfferCloseButton = uselessOffer.querySelector('.popup__close');

    uselessOfferCloseButton.removeEventListener('click', onOfferCloseButtonPress);
    window.removeEventListener('keydown', onOfferEscPress);

    uselessOffer.parentNode.removeChild(uselessOffer);
  }
}

/**
* Добавление необходимому пину класса-модификатора .map__pin--active.
* Применяется при переключение пинов.
*
* @function setPinActivityModifier
* @param {object} pin — DOM элемент
*/
function setPinActivityModifier(pin) {
  pin.classList.add('map__pin--active');
}

/**
* Удаление класса-модификатора .map__pin--active у ненужного пина
* Применяется при переключении пинов.
*
* @function removeUselessPinActivityModifier
*/
function removeUselessPinActivityModifier() {
  var uselessActivePin = MAP.querySelector('.map__pin--active');

  if (uselessActivePin) {
    uselessActivePin.classList.remove('map__pin--active');
  }
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
  var pinArea = MAP.querySelector('.map__pins');
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var pinsFragment = document.createDocumentFragment();

  for (var i = 0; i < expectedNumber; i++) {
    var pin = pinTemplate.cloneNode(true);
    var img = pin.querySelector('img');

    pin.style.left = sourceOffers[i].location.x - PIN_SHIFT_X + 'px';
    pin.style.top = sourceOffers[i].location.y - PIN_SHIFT_Y + 'px';
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

  var source = sourceOffers[index];

  avatar.src = source.author.avatar;
  title.textContent = source.offer.title;
  address.textContent = source.offer.address;
  price.textContent = source.offer.price + '\u20bd / ночь';
  type.textContent = decodePropertyType(source.offer.type, OFFERS_PROPERTY_TYPES);
  capacity.textContent = source.offer.rooms + ' комнаты для ' + source.offer.guests + ' гостей';
  stayTime.textContent = 'Заезд после ' + source.offer.checkin + ', выезд до ' + source.offer.checkout;
  description.textContent = source.offer.description;
  featuresList.innerHTML = '';
  featuresList.appendChild(createFeaturesMarkup(source.offer.features));

  offerFragment.appendChild(offer);

  var offerInsertPoint = MAP.querySelector('.map__filters-container');
  MAP.insertBefore(offerFragment, offerInsertPoint);
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

      return requestedDefinition;
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

/*
***********************************************************************************
***********************************************************************************
***
***             ФОРМА СОЗДАНИЯ ОБЪЯВЛЕНИЙ: СИНХРОНИЗАЦИЯ И ВАЛИДАЦИЯ
***
***********************************************************************************
***********************************************************************************
*/

/**
* Синхронизация опций селектов "Время заезда и выезда".
* Синхронизируются <select> #timein и #timeout в форме создания объявлений .notice__form.
*
* @function syncFormTimes
*/
function syncFormTimes() {
  var selectCheckin = document.querySelector('select#timein');
  var selectCheckout = document.querySelector('select#timeout');

  selectCheckin.addEventListener('input', function () {
    selectCheckout.selectedIndex = selectCheckin.selectedIndex;
  });

  selectCheckout.addEventListener('input', function () {
    selectCheckin.selectedIndex = selectCheckout.selectedIndex;
  });
}

/**
* Синхронизация опций селектов "Количество комнат" и "Количество мест".
* Синхронизируются <select> #room_number и #capacity
*
* @function syncFormPropertyCapacity
*/
function syncFormPropertyCapacity() {
  var selectRooms = document.querySelector('select#room_number');
  var selectCapacity = document.querySelector('select#capacity');

  selectRooms.addEventListener('input', function () {
    switch (selectRooms.selectedIndex) {
      case 0: // 1 комната
        selectCapacity.selectedIndex = 2; // для 1 гостя
        break;
      case 1: // 2 комнаты
        selectCapacity.selectedIndex = 1; // для 2-х гостей
        break;
      case 2: // 3 комнаты
        selectCapacity.selectedIndex = 0; // для 3-х гостей
        break;
      case 3: // 100 комнат
        selectCapacity.selectedIndex = 3; // не для гостей
        break;
    }
  });
}

/**
* Синхронизация опций селекта "Тип жилья" с подсказкой стоимости в "Цена за ночь".
* Синхронизируются <select> #type и значение placeholder в <input> #price.
*
* @function syncFormPropertyPrice
*/
function syncFormPropertyPrice() {
  var selectType = document.querySelector('select#type');
  var inputPrice = document.querySelector('input#price');

  selectType.addEventListener('input', function () {
    switch (selectType.selectedIndex) {
      case 0: // Лачуга
        inputPrice.placeholder = '0'; // Стоимость 0
        inputPrice.min = '0';
        break;
      case 1: // Квартира
        inputPrice.placeholder = '1000'; // Стоимость 1.000
        inputPrice.min = '1000';
        break;
      case 2: // Дом
        inputPrice.placeholder = '5000'; // Стоимость 5.000
        inputPrice.min = '5000';
        break;
      case 3: // Дворец
        inputPrice.placeholder = '10000'; // Стоимость 10.000
        inputPrice.min = '10000';
        break;
    }
  });
}

/**
* Контроль валидности обязательных полей формы (формы создания объявлений).
*
* @function watchFormValidity
*/
function watchFormValidity() {
  var inputTitle = USER_FORM.querySelector('input#title');
  var inputAddress = USER_FORM.querySelector('input#address');
  var inputPrice = USER_FORM.querySelector('input#price');

  inputTitle.addEventListener('invalid', onInvalidInput);
  inputAddress.addEventListener('invalid', onInvalidInput);
  inputPrice.addEventListener('input', onInvalidInput);
  inputPrice.addEventListener('invalid', onInvalidInput);
}

/**
* Контроль валидности объекта события
*
* @function onInvalidInput
* @param {object} evt — объект события
*/
function onInvalidInput(evt) {
  var target = evt.target;
  var valueLength = target.value.length;

  if (target.validity.valueMissing) {
    if (target.validity.badInput) {
      target.setCustomValidity('Неверный формат ввода: допустимы только числа.');
    } else {
      target.setCustomValidity('Это поле не должно быть пустым.');
    }
  } else if (target.validity.tooShort) {
    target.setCustomValidity('Минимально допустимая длина: 30 символов. Сейчас: ' + valueLength + '.');
  } else if (target.validity.tooLong) {
    target.setCustomValidity('Максимально допустимая длина: 100 символов. Сейчас: ' + valueLength + '.');
  } else if (target.validity.rangeUnderflow) {
    target.setCustomValidity('Минимально допустимое значение: 0.');
  } else if (target.validity.rangeOverflow) {
    target.setCustomValidity('Максимально допустимое значение: 1 000 000.');
  } else {
    target.setCustomValidity('');
  }
}
