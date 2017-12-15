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
    window.constants.CONTROL_PIN.addEventListener('mousedown', onControlPinDragStart);
    window.render.renderPins(8, window.data.offers);
    window.form.activateForm();
    window.constants.PINS_CONTAINER.addEventListener('click', onPinClick);
  }

  /*
  ***********************************************************************************
  ***********************************************************************************
  ***
  ***                             ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ:
  ***      ПЕРЕМЕЩЕНИЕ УПРАВЛЯЮЩЕГО ПИНА + ИЗМЕНЕНИЕ КООРДИНАТ АДРЕСА В ФОРМЕ
  ***
  ***********************************************************************************
  ***********************************************************************************
  */

  /**
  * Фиксирование координат в момент начала драга на управляющем пине,
  * вызов вспомогательных функций для основного процесса перемещения.
  *
  * @function onControlPinDragStart
  * @param {object} downEvt — объект события, зажатие ЛКМ
  */
  function onControlPinDragStart(downEvt) {
    downEvt.preventDefault();

    var startCoords = {
      x: downEvt.clientX,
      y: downEvt.clientY
    };

    document.addEventListener('mousemove', onControlPinDrag);
    document.addEventListener('mouseup', onControlPinDragEnd);

    /**
    * Перемещение управляющего пина.
    * Смещение курсора мыши вызывает соразмерное смещение пина.
    * Новые координаты пина передаются в графу "адрес" формы объявлений.
    *
    * @function onControlPinDrag
    * @param {object} moveEvt — объект события, перемещение мыши
    */
    function onControlPinDrag(moveEvt) {
      moveEvt.preventDefault();

      var shiftDistance = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var newCoordsX = window.constants.CONTROL_PIN.offsetLeft - shiftDistance.x;
      var newCoordsY = window.constants.CONTROL_PIN.offsetTop - shiftDistance.y;

      if (newCoordsY < window.constants.COORDS_MIN_LIMIT_Y) {
        newCoordsY = window.constants.COORDS_MIN_LIMIT_Y;
      } else if (newCoordsY > window.constants.COORDS_MAX_LIMIT_Y) {
        newCoordsY = window.constants.COORDS_MAX_LIMIT_Y;
      }

      window.constants.CONTROL_PIN.style.left = newCoordsX + 'px';
      window.constants.CONTROL_PIN.style.top = newCoordsY + 'px';

      var inputAddress = window.constants.FORM.querySelector('input#address');
      inputAddress.value =
        'x: ' + newCoordsX + ', ' +
        'y: ' + (newCoordsY + window.constants.CONTROL_PIN_SHIFT_Y);
    }

    /**
    * Завершение драга на управляющем пине — удаление слушателей.
    * Хендлер прекращает контроль за перемещением мыши и удаляет сам себя.
    *
    * @function onControlPinDragEnd
    * @param {object} endEvt — объект события, отжатие ЛКМ
    */
    function onControlPinDragEnd(endEvt) {
      endEvt.preventDefault();
      document.removeEventListener('mousemove', onControlPinDrag);
      document.removeEventListener('mouseup', onControlPinDragEnd);
    }
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
