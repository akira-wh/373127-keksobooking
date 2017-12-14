'use strict';

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
*
* Создается Document Fragment, заполняется разметкой и внедряется на страницу.
* Информационная составляющая снимается с объектов-объявлений массива window.offers[].
* Разметка каждого пина основана на шаблоне <button class="map__pin"> из списка <template>.
*
* @function renderPins
* @param {number} expectedNumber — необходимое число отрисованных пинов
* @param {array} sourceOffers — массив объектов-объявлений для съема данных
*/
window.renderPins = function (expectedNumber, sourceOffers) {
  var pinArea = window.constants.MAP.querySelector('.map__pins');
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var pinsFragment = document.createDocumentFragment();

  for (var i = 0; i < expectedNumber; i++) {
    var pin = pinTemplate.cloneNode(true);
    var img = pin.querySelector('img');

    pin.style.left = sourceOffers[i].location.x - window.constants.PIN_SHIFT_X + 'px';
    pin.style.top = sourceOffers[i].location.y - window.constants.PIN_SHIFT_Y + 'px';
    img.src = sourceOffers[i].author.avatar;

    pinsFragment.appendChild(pin);
  }

  pinArea.appendChild(pinsFragment);
};
