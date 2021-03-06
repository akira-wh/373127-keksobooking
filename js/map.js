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

  // Взаимодействие с управляющим пином.
  //
  // 1. Когда сайт неактивен и пин перемещается:
  // по завершению обновляются координаты адреса в форме,
  // активируется основной функционал сайта,
  // удаляется возможность активировать сайт повторно по ENTER.
  //
  // 2. Когда сайт активен и пин перемещается повторно:
  // обновляются только координаты в форме.
  //
  // 3. Когда сайт неактивен и на пине нажат ENTER:
  // активируется основной функционал сайта,
  // удаляется возможность активировать сайт повторно по ENTER.
  //
  // 4. Когда сайт активен и на пине нажат ENTER:
  // реакции не будет, удалена в пункте 3.
  window.constants.CONTROL_PIN.addEventListener('mousedown', onControlPinMousedown);
  window.constants.CONTROL_PIN.addEventListener('keydown', onControlPinFirstEnterPress);

  /**
  * Запуск основного функционала сайта по нажатию ENTER на управляющем пине.
  * После выполнения, обработчик удаляет возможность вызвать себя повторно.
  *
  * @function onControlPinFirstEnterPress
  * @param {object} evt — объект события, нажатая клавиша ENTER
  */
  function onControlPinFirstEnterPress(evt) {
    if (evt.keyCode === window.constants.ENTER_KEYCODE) {
      activateServices();
      window.constants.CONTROL_PIN.removeEventListener('keydown', onControlPinFirstEnterPress);
    }
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
    window.backend.load(onLoad, onError);
    window.constants.PINS_CONTAINER.addEventListener('click', onPinClick);
    window.form.activate();
  }

  /**
   * Callback при успешном получении данных с сервера:
   * сохранение данных в глобальный массив window.data[],
   * проставление объявлениям идентифицирующего серийного номера,
   * отрисовка пинов с соответствующими серийными номерами,
   * запуск работы фильтров.
   *
   * @function onLoad
   * @param {object} receivedData — полученные данные
   */
  function onLoad(receivedData) {
    window.data = receivedData;

    for (var i = 0; i < window.data.length; i++) {
      window.data[i]['data-serial'] = i;
    }

    window.showPins(window.constants.PINS_MAX_LIMIT, window.data);
    window.filters.activate();
  }

  /**
   * Callback при получении HTTP ошибки: расшифровка и оповещения клиента.
   *
   * @function onError
   * @param {number} errorCode — HTTP код ошибки
   */
  function onError(errorCode) {
    window.constants.HTTP_ERRORS.showModal(errorCode);
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

  // Буфер хранения сдвига (расстояния в px) мыши относительно left/top
  // края управляющего пина. Данный буфер помогает удерживать
  // зажатую мышь на определенной точке пина всегда.
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
   * Новые координаты пина передаются в графу "адрес" формы объявлений.
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
   * Если сайт был неактивен — активация основного функционала,
   * удаление возможности повторной активации по нажатию ENTER.
   *
   * @function onControlPinMouseup
   * @param {object} upEvt — объект события, отжатие ЛКМ
   */
  function onControlPinMouseup(upEvt) {
    upEvt.preventDefault();

    if (window.constants.MAP.classList.contains('map--faded') &&
        window.constants.FORM.classList.contains('notice__form--disabled')) {
      activateServices();
      window.constants.CONTROL_PIN.removeEventListener('keydown', onControlPinFirstEnterPress);
    }

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
   * Фиксирование сдвига/расстояния между мышью и left/top краем управляющего пина.
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
   * не менее 110 по Y min, не более 655 по Y max,
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
    window.constants.FORM_ADDRESS.value =
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
    var target = evt.target;

    // Проверка на то, что вызванный элемент — пин.
    // Проверка идет от глубоких элементов наверх, пока evt.target не всплывет до currentTarget
    while (target !== window.constants.PINS_CONTAINER) {

      if (target.className === 'map__pin') {
        removeUselessCard();
        removeUselessPinActivityModifier();

        // Здесь у пина считывается порядковый номер по доп.идентификатору data-serial.
        // Определенный data-serial соответствует определенному индексу объявления по базе
        // Вызывается отрисовка объявления с соответствующим индексом.
        var referenceSerial = target.dataset.serial;
        window.showCard(window.data, referenceSerial);
        setPinActivityModifier(target);

        // Здесь регистрируется отлов событий для закрытия объявления.
        var cardCloseButton = window.constants.MAP.querySelector('.popup .popup__close');
        cardCloseButton.addEventListener('click', onCardCloseButtonPress);
        window.addEventListener('keydown', onWindowEscPress);

        return;
      }

      // Если target НЕ искомый элемент — проверяется родительский узел.
      target = target.parentNode;
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
