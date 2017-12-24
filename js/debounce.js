'use strict';

/*
***********************************************************************************
***********************************************************************************
***
***                                    DEBOUNCE
***
***********************************************************************************
***********************************************************************************
*/


(function () {

  var lastTimeout = null;

  /**
  * Дебанус для переданной в качестве callback функции.
  *
  * @function debounce
  * @param {function} callback — функция, к которой применяется дебанус
  */
  window.debounce = function (callback) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }

    lastTimeout = window.setTimeout(callback, window.constants.DEBOUNCE_DELAY);
  };
})();
