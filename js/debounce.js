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

  window.debounce = function (callback) {

    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }

    lastTimeout = window.setTimeout(callback, window.constants.DEBOUNCE_INTERVAL);
  };
})();
