'use strict';

/*
***********************************************************************************
***********************************************************************************
***
***                           ОСНОВНОЙ ФУНКЦИОНАЛ ПОРТАЛА:
***                       АКТИВАЦИЯ ПОЛЬЗОВАТЕЛЬСКИХ СЕРВИСОВ
***                     ПРИ ВЗАИМОДЕЙСТВИИ С УПРАВЛЯЮЩИМ ПИНОМ
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
    window.render.renderPins(8, window.data.offers);
    window.form.activateUserForm();
    window.constants.PINS_CONTAINER.addEventListener('click', onPinClick);
  }

  /*
  ***********************************************************************************
  ***********************************************************************************
  ***
  ***                             ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ:
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
