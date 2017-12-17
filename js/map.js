'use strict';

/*
***********************************************************************************
***********************************************************************************
***
***                           ОСНОВНОЙ ФУНКЦИОНАЛ ПОРТАЛА:
***                       АКТИВАЦИЯ ПОЛЬЗОВАТЕЛЬСКИХ СЕРВИСОВ
***                  ПРИ ПЕРВОМ ВЗАИМОДЕЙСТВИИ С УПРАВЛЯЮЩИМ ПИНОМ
***
***********************************************************************************
***********************************************************************************
*/

(function () {

  // Отлов первого взаимодействия с управляющим пином -> запуск основного функционала сайта
  // После исполнения обоработчика - отлов удаляется.
  window.constants.CONTROL_PIN.addEventListener('click', onControlPinFirstClick);

  /**
  * Активация основного функционала сайта.
  * Вызывается по первому КЛИКУ мышью, нажатию ENTER или SPACE на управлящем пине.
  * После исполнения обоработчика - возможность повторного вызова исключается.
  *
  * @function onControlPinFirstClick
  */
  function onControlPinFirstClick() {
    activateServices();
    window.constants.CONTROL_PIN.removeEventListener('click', onControlPinFirstClick);
  }

  /**
  * Активация основных пользовательских сервисов:
  * 1. Запуск карты
  * 2. Отрисовывка пинов,
  * 3. Запуск формы создания объявлений,
  * 4. Отлов переключения пинов/объявлений.
  *
  * @function activateServices
  */
  function activateServices() {
    window.constants.MAP.classList.remove('map--faded');
    window.constants.CONTROL_PIN.addEventListener('mousedown', onControlPinMousedown);
    window.render.renderPins(8, window.data.offers);
    window.form.activate();
    window.constants.PINS_CONTAINER.addEventListener('click', onPinClick);
  }

  /*
  ***********************************************************************************
  ***********************************************************************************
  ***
  ***                             ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ:
  ***       ПЕРЕМЕЩЕНИЕ УПРАВЛЯЮЩЕГО ПИНА + ИЗМЕНЕНИЕ КООРДИНАТ АДРЕСА В ФОРМЕ
  ***
  ***********************************************************************************
  ***********************************************************************************
  */

  var startCoords = {
    x: null,
    y: null
  };

  /**
  * Фиксирование координат в момент начала драга на управляющем пине,
  * вызов вспомогательных функций для основного процесса перемещения.
  *
  * @function onControlPinMousedown
  * @param {object} downEvt — объект события, зажатие ЛКМ
  */
  function onControlPinMousedown(downEvt) {
    downEvt.preventDefault();

    rewriteStartCoords(downEvt);

    document.addEventListener('mousemove', onControlPinMousemove);
    document.addEventListener('mouseup', onControlPinMouseup);
  }

  /**
  * Равнозначное смещение пина вслед за смещением курсора мыши.
  * Новые координаты пина передаются в графу "адрес" формы объявлений.
  *
  * @function onControlPinMousemove
  * @param {object} moveEvt — объект события, перемещение мыши
  */
  function onControlPinMousemove(moveEvt) {
    moveEvt.preventDefault();

    var shiftDistance = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    rewriteStartCoords(moveEvt);

    var newCoords = getNewCoords(shiftDistance.x, shiftDistance.y);
    changeControlPinPosition(newCoords);
    changePropertyAddress(newCoords);
  }

  /**
  * Завершение драга на управляющем пине — удаление слушателей.
  * Хендлер прекращает контроль за перемещением мыши и удаляет сам себя.
  *
  * @function onControlPinMouseup
  * @param {object} upEvt — объект события, отжатие ЛКМ
  */
  function onControlPinMouseup(upEvt) {
    upEvt.preventDefault();

    document.removeEventListener('mousemove', onControlPinMousemove);
    document.removeEventListener('mouseup', onControlPinMouseup);
  }

  /**
  * Запись/обновление стартовых координат события.
  *
  * @function rewriteStartCoords
  * @param {object} evt — объект события
  */
  function rewriteStartCoords(evt) {
    startCoords.x = evt.clientX;
    startCoords.y = evt.clientY;
  }

  /**
  * Обновление координат управляющего пина.
  *
  * Координаты ограничены лимитом:
  * не менее 100 по Y min, не более 500 по Y max,
  * не менее 0 по X min, не более 1200 по X max.
  *
  * @function getNewCoords
  * @param {number} shiftX — число, разница в расстоянии от стартовых координат по X
  * @param {number} shiftY — число, разница в расстоянии от стартовых координат по Y
  * @return {object} — объект с новыми координатами
  */
  function getNewCoords(shiftX, shiftY) {
    var newCoords = {
      x: window.constants.CONTROL_PIN.offsetLeft - shiftX,
      y: window.constants.CONTROL_PIN.offsetTop - shiftY
    };

    if (newCoords.x < window.constants.COORDS_MIN_LIMIT_X) {
      newCoords.x = window.constants.COORDS_MIN_LIMIT_X;
    } else if (newCoords.x > window.constants.COORDS_MAX_LIMIT_X) {
      newCoords.x = window.constants.COORDS_MAX_LIMIT_X;
    }

    if (newCoords.y < window.constants.COORDS_MIN_LIMIT_Y) {
      newCoords.y = window.constants.COORDS_MIN_LIMIT_Y;
    } else if (newCoords.y > window.constants.COORDS_MAX_LIMIT_Y) {
      newCoords.y = window.constants.COORDS_MAX_LIMIT_Y;
    }

    return newCoords;
  }

  /**
  * Перемещение управляющего пина на заданные координаты.
  *
  * @function changeControlPinPosition
  * @param {object} newCoords — объект с новыми координатами для пина
  */
  function changeControlPinPosition(newCoords) {
    window.constants.CONTROL_PIN.style.left = newCoords.x + 'px';
    window.constants.CONTROL_PIN.style.top = newCoords.y + 'px';
  }

  /**
  * Обновление координат недвижимости в поле формы "Адрес".
  *
  * @function changePropertyAddress
  * @param {object} newCoords — объект с новыми координатами адреса недвижимости
  */
  function changePropertyAddress(newCoords) {
    var inputAddress = window.constants.FORM.querySelector('input#address');

    inputAddress.value =
      'x: ' + newCoords.x + ', ' +
      'y: ' + (newCoords.y + window.constants.CONTROL_PIN_SHIFT_Y);
  }

  /*
  ***********************************************************************************
  ***********************************************************************************
  ***
  ***             ПЕРЕКЛЮЧЕНИЕ ПИНОВ И ОБЪЯВЛЕНИЙ, ЗАКРЫТИЕ ОБЪЯВЛЕНИЙ
  ***
  ***********************************************************************************
  ***********************************************************************************
  */

  /**
  * Отрисовка рядом с выбранным пином соответствующего тому объявления.
  * Проверка на всплытии. Индекс пина соответствует индексу объявления.
  *
  * @function onPinClick
  * @param {object} evt — объект события
  */
  function onPinClick(evt) {
    var pins = window.constants.PINS_CONTAINER.querySelectorAll('button:not(.map__pin--main)');
    var pinsNumber = pins.length;
    var target = evt.target;

    // Проверка на то, что вызванный элемент — пин.
    // Проверка идет от самых глубоких элементов наверх, пока evt.target не всплывет до currentTarget
    while (target !== window.constants.PINS_CONTAINER) {

      // Если target — искомый пин...
      if (target.className === 'map__pin') {

        // Определяется его порядковый индекс (индекс в массиве пинов).
        // Когда индекс установлен — вызывается соответствующее этому индексу объявление (старое удаляется).
        for (var i = 0; i < pinsNumber; i++) {
          if (pins[i] === target) {

            removeUselessOffer();
            removeUselessPinActivityModifier();

            var referenceIndex = i;
            window.render.renderOffer(window.data.offers, referenceIndex);
            setPinActivityModifier(target);

            // Здесь регистрируется отлов событий для закрытия объявления.
            var offerCloseButton = window.constants.MAP.querySelector('.popup .popup__close');
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
  * Удаление ненужного объявления и отлова его событий.
  *
  * @function removeUselessOffer
  */
  function removeUselessOffer() {
    var uselessOffer = window.constants.MAP.querySelector('.popup');

    if (uselessOffer) {
      var uselessOfferCloseButton = uselessOffer.querySelector('.popup__close');

      uselessOfferCloseButton.removeEventListener('click', onOfferCloseButtonPress);
      window.removeEventListener('keydown', onOfferEscPress);

      uselessOffer.parentNode.removeChild(uselessOffer);
    }
  }

  /**
  * Удаление класса-модификатора .map__pin--active у ненужного пина
  * Применяется при переключении пинов.
  *
  * @function removeUselessPinActivityModifier
  */
  function removeUselessPinActivityModifier() {
    var uselessActivePin = window.constants.MAP.querySelector('.map__pin--active');

    if (uselessActivePin) {
      uselessActivePin.classList.remove('map__pin--active');
    }
  }

  /**
  * Добавление необходимому пину класса-модификатора .map__pin--active.
  * Применяется при переключение пинов.
  *
  * @function setPinActivityModifier
  * @param {node} pin — DOM элемент
  */
  function setPinActivityModifier(pin) {
    pin.classList.add('map__pin--active');
  }

  /**
  * Удаление ненужного объявления, отлова его событий,
  * а также модификатора активности у соответствующего пина.
  * Вызывается нажатием на кнопку ЗАКРЫТЬ в объявлении.
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
    if (evt.keyCode === window.constants.ESC_KEYCODE) {
      removeUselessOffer();
      removeUselessPinActivityModifier();
    }
  }
})();
