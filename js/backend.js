'use strict';

/*
***********************************************************************************
***********************************************************************************
***
***                        ВЗАИМОДЕЙСТВИЕ С СЕРВЕРОМ ДАННЫХ:
***                ПОЛУЧЕНИЕ ОБЪЯВЛЕНИЙ, ОТПРАВКА ЗАПОЛНЕННОЙ ФОРМЫ
***
***********************************************************************************
***********************************************************************************
*/

(function () {

  window.backend = {

    /**
     * Получение данных (объявлений) с сервера.
     *
     * @method load
     * @param {callback} onLoad — callback, обрабатывающий данные
     * @param {callback} onError — callback, обрабатывающий ошибки
     */
    load: function (onLoad, onError) {
      var xhr = getBasicTunedXhr(onLoad, onError);
      xhr.open('GET', window.constants.SERVER_DOWNLOAD_URL, true);
      xhr.send();
    },

    /**
     * Загрузка данных формы на сервер.
     *
     * @method save
     * @param {object} data — объект с данными формы
     * @param {callback} onLoad — callback, обрабатывающий данные
     * @param {callback} onError — callback, обрабатывающий ошибки
     */
    save: function (data, onLoad, onError) {
      var xhr = getBasicTunedXhr(onLoad, onError);
      xhr.open('POST', window.constants.SERVER_UPLOAD_URL, true);
      xhr.send(data);
    }
  };

  /**
  * Базовая настройка XMLHttpRequest.
  * Подходит для получения данных и отправки.
  * Не содержит конечных команд OPEN() и SEND().
  *
  * @function getBasicTunedXhr
  * @param {callback} onLoad — callback, обрабатывающий данные
  * @param {callback} onError — callback, обрабатывающий ошибки
  * @return {object} — настроенный XMLHttpRequest объект
  */
  function getBasicTunedXhr(onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = window.constants.HTTP_TIMEOUT_LIMIT;

    xhr.addEventListener('load', function () {
      if (xhr.status === window.constants.HTTP_STATUS_OK) {
        onLoad(xhr.response);
      }
    });

    xhr.addEventListener('error', function () {
      onError(xhr.status);
    });

    return xhr;
  }
})();
