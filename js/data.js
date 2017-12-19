'use strict';

/*
***********************************************************************************
***********************************************************************************
***
***                     ПОЛУЧЕНИЕ ДАННЫХ ОБЪЯВЛЕНИЙ С СЕРВЕРА
***         СОХРАНЕНИЕ ДАННЫХ В ГЛОБАЛЬНЫЙ МАССИВ window.data.offers[]
***
***********************************************************************************
***********************************************************************************
*/

(function () {

  // Запрос объявлений с сервера
  window.backend.load(onLoad, onError);

  /**
   * Callback при успешном получении данных: запись их в массив window.data.offers[].
   *
   * @function onLoad
   * @param {object} receivedData — полученные данные
   */
  function onLoad(receivedData) {
    window.data = {
      offers: receivedData
    };
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
})();
