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
    window.showPins(8, window.data.offers);
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

  // Буфер координат мыши в процессе перетаскивания управляющего пина
  var mouseCoords = {
    x: null,
    y: null
  };

  // Буфер хранения сдвига (расстояния в px) мыши относительно left/top края управляющего пина
  var mouseOnControlPinShift = {
    x: null,
    y: null
  };

  /**
   * Фиксирование координат мыши в момент начала драга на управляющем пине,
   * фиксирование сдвига между мышью и управляющим пином,
   * вызов вспомогательных функций для основного процесса перемещения.
   *
   * @function onControlPinMousedown
   * @param {object} downEvt — объект события, зажатие ЛКМ
   */
  function onControlPinMousedown(downEvt) {
    downEvt.preventDefault();

    fixMouseCoords(downEvt);
    fixMouseOnControlPinShift();

    document.addEventListener('mousemove', onControlPinMousemove);
    document.addEventListener('mouseup', onControlPinMouseup);
  }

  /**
   * Перемещение пина вслед за перемещением курсора мыши (с учетом сдвига).
   * Новые координаты пина также передаются в графу "адрес" формы объявлений.
   *
   * @function onControlPinMousemove
   * @param {object} moveEvt — объект события, перемещение мыши
   */
  function onControlPinMousemove(moveEvt) {
    moveEvt.preventDefault();

    fixMouseCoords(moveEvt);

    var newControlPinCoords = getNewControlPinCoords(mouseCoords, mouseOnControlPinShift);
    changeControlPinPosition(newControlPinCoords);
    changePropertyAddress(newControlPinCoords);
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
   * Запись/обновление координат события (драга).
   *
   * @function fixMouseCoords
   * @param {object} evt — объект события, движение зажатой ЛКМ
   */
  function fixMouseCoords(evt) {
    mouseCoords.x = evt.clientX;
    mouseCoords.y = evt.clientY;
  }

  /**
   * Фиксирование сдвига/расстояния между мышью и left-top краем управляющего пина.
   * Используются для сохранения точки зажатия пина мышью.
   *
   * @function fixMouseOnControlPinShift
   */
  function fixMouseOnControlPinShift() {
    mouseOnControlPinShift.x = mouseCoords.x - window.constants.CONTROL_PIN.offsetLeft;
    mouseOnControlPinShift.y = mouseCoords.y - window.constants.CONTROL_PIN.offsetTop;
  }

  /**
   * Обновление координат управляющего пина.
   *
   * Координаты лимитированы:
   * не менее 100 по Y min, не более 500 по Y max,
   * не менее 0 по X min, не более 1200 по X max.
   *
   * @function getNewControlPinCoords
   * @param {object} mouseCoordinates — X/Y координаты драга
   * @param {object} mouseOnPinShift — X/Y сдвиг мыши на управляющем пине
   * @return {object} — объект с новыми координатами
   */
  function getNewControlPinCoords(mouseCoordinates, mouseOnPinShift) {
    var newControlPinCoords = {
      x: mouseCoordinates.x - mouseOnPinShift.x,
      y: mouseCoordinates.y - mouseOnPinShift.y
    };

    if (newControlPinCoords.x < window.constants.COORDS_MIN_LIMIT_X) {
      newControlPinCoords.x = window.constants.COORDS_MIN_LIMIT_X;
    } else if (newControlPinCoords.x > window.constants.COORDS_MAX_LIMIT_X) {
      newControlPinCoords.x = window.constants.COORDS_MAX_LIMIT_X;
    }

    if (newControlPinCoords.y < window.constants.COORDS_MIN_LIMIT_Y) {
      newControlPinCoords.y = window.constants.COORDS_MIN_LIMIT_Y;
    } else if (newControlPinCoords.y > window.constants.COORDS_MAX_LIMIT_Y) {
      newControlPinCoords.y = window.constants.COORDS_MAX_LIMIT_Y;
    }

    return newControlPinCoords;
  }

  /**
   * Перемещение управляющего пина на заданные координаты.
   *
   * @function changeControlPinPosition
   * @param {object} newControlPinCoords — объект с новыми координатами для пина
   */
  function changeControlPinPosition(newControlPinCoords) {
    window.constants.CONTROL_PIN.style.left = newControlPinCoords.x + 'px';
    window.constants.CONTROL_PIN.style.top = newControlPinCoords.y + 'px';
  }

  /**
   * Обновление адреса недвижимости в форме согласно новым координатам управляющего пина.
   *
   * @function changePropertyAddress
   * @param {object} newControlPinCoords — объект с новыми координатами пина
   */
  function changePropertyAddress(newControlPinCoords) {
    var inputAddress = window.constants.FORM.querySelector('input#address');

    inputAddress.value =
      'x: ' + newControlPinCoords.x + ', ' +
      'y: ' + (newControlPinCoords.y + window.constants.CONTROL_PIN_SHIFT_Y);
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

            removeUselessCard();
            removeUselessPinActivityModifier();

            var referenceIndex = i;
            window.showCard(window.data.offers, referenceIndex);
            setPinActivityModifier(target);

            // Здесь регистрируется отлов событий для закрытия объявления.
            var cardCloseButton = window.constants.MAP.querySelector('.popup .popup__close');
            cardCloseButton.addEventListener('click', onCardCloseButtonPress);
            window.addEventListener('keydown', onWindowEscPress);

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
   * @function removeUselessCard
   */
  function removeUselessCard() {
    var uselessCard = window.constants.MAP.querySelector('.popup');

    if (uselessCard) {
      var uselessCardCloseButton = uselessCard.querySelector('.popup__close');

      uselessCardCloseButton.removeEventListener('click', onCardCloseButtonPress);
      window.removeEventListener('keydown', onWindowEscPress);

      uselessCard.parentNode.removeChild(uselessCard);
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
   * @function onCardCloseButtonPress
   */
  function onCardCloseButtonPress() {
    removeUselessCard();
    removeUselessPinActivityModifier();
  }

  /**
   * Удаление ненужного объявления, отлова его событий,
   * а также модификатора активности у соответствующего пина.
   * Вызывается нажатием на ESC при открытом объявлении.
   *
   * @function onWindowEscPress
   * @param {object} evt — объект события
   */
  function onWindowEscPress(evt) {
    if (evt.keyCode === window.constants.ESC_KEYCODE) {
      removeUselessCard();
      removeUselessPinActivityModifier();
    }
  }
})();
