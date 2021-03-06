'use strict';

/*
***********************************************************************************
***********************************************************************************
***
***                          РАЗМЕТКА + ОТРИСОВКА НА КАРТЕ
***                                      ПИНОВ
***
***********************************************************************************
***********************************************************************************
*/

(function () {

  /**
   * Создание и отрисовка пользовательских пинов.
   *
   * Создается Document Fragment, заполняется разметкой и внедряется на страницу.
   * Информационная составляющая снимается с объявлений window.data[].
   * Разметка каждого пина основана на шаблоне <button class="map__pin"> из списка <template>.
   *
   * @method showPins
   * @param {number} expectedNumber — необходимое число отрисованных пинов
   * @param {array} sourceOffers — массив объектов-объявлений для съема данных
   */
  window.showPins = function (expectedNumber, sourceOffers) {
    var pinsFragment = document.createDocumentFragment();

    for (var i = 0; i < expectedNumber; i++) {
      var pin = window.constants.PIN_TEMPLATE.cloneNode(true);
      var img = pin.querySelector('img');

      pin.style.left = sourceOffers[i].location.x - window.constants.PIN_SHIFT_X + 'px';
      pin.style.top = sourceOffers[i].location.y - window.constants.PIN_SHIFT_Y + 'px';
      pin.dataset.serial = sourceOffers[i]['data-serial'];
      img.src = sourceOffers[i].author.avatar;

      pinsFragment.appendChild(pin);
    }

    window.constants.PINS_CONTAINER.appendChild(pinsFragment);
  };
})();
