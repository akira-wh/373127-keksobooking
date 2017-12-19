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
     * @param {callback} onLoad — коллбэк, забирающий данные
     * @param {callback} onError — коллбэк, забирающий ошибки
     */
    load: function (onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.status === window.constants.HTTP_STATUS_OK) {
          onLoad(xhr.response);
        }
      });

      xhr.addEventListener('error', function () {
        onError(xhr.status);
      });

      xhr.open('GET', window.constants.SERVER_DOWNLOAD_URL, true);
      xhr.send();
    },

    /**
     * Загрузка данных формы на сервер.
     *
     * @method save
     * @param {object} data — объект с данными формы
     * @param {callback} onLoad — коллбэк, забирающий данные
     * @param {callback} onError — коллбэк, забирающий ошибки
     */
    save: function (data, onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.status === window.constants.HTTP_STATUS_OK) {
          onLoad(xhr.response);
        }
      });

      xhr.addEventListener('error', function () {
        onError(xhr.status);
      });

      xhr.open('POST', window.constants.SERVER_UPLOAD_URL, true);
      xhr.send(data);
    }
  };
})();
