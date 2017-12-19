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
   * Callback для получения данных и передачи в массив window.data.offers[] .
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
  * Callback для получения кода HTTP ошибки и оповещения клиента
  *
  * @function onError
  * @param {number} errorCode — HTTP код ошибки
  */
  function onError(errorCode) {
    var errorModal = document.createElement('div');
    errorModal.className = 'error-modal';
    errorModal.style.width = '200px';
    errorModal.style.padding = '30px';
    errorModal.style.position = 'absolute';
    errorModal.style.left = '50%';
    errorModal.style.top = '50%';
    errorModal.style.border = 'solid 5px ' + window.constants.COLOR_ORANGE;
    errorModal.style.borderRadius = '5px';
    errorModal.style.transform = 'translate(-50%, -50%)';
    errorModal.style.zIndex = '100';
    errorModal.style.backgroundColor = 'white';
    errorModal.style.textAlign = 'center';
    errorModal.style.fontWeight = 'bold';

    var errorText = document.createElement('p');
    errorText.textContent = decodeHttpError(errorCode);
    errorText.style.padding = '0';
    errorText.style.margin = '0 0 25px 0';

    var errorCloseButton = document.createElement('button');
    errorCloseButton.type = 'button';
    errorCloseButton.textContent = 'Закрыть';
    errorCloseButton.style.width = '100px';
    errorCloseButton.style.padding = '5px 10px 5px 10px';
    errorCloseButton.style.border = '0';
    errorCloseButton.style.backgroundColor = window.constants.COLOR_ORANGE;
    errorCloseButton.style.textAlign = 'center';
    errorCloseButton.style.color = 'white';
    errorCloseButton.style.cursor = 'pointer';

    errorModal.appendChild(errorText);
    errorModal.appendChild(errorCloseButton);
    window.constants.MAP.appendChild(errorModal);

    errorCloseButton.addEventListener('click', onErrorModalCloseButtonPress);
  }

  /**
  * Расшифровка HTTP ошибок.
  *
  * @function decodeHttpError
  * @param {number} errorCode — код ошибки
  * @return {string} — расшифрованное сообщение об ошибке
  */
  function decodeHttpError(errorCode) {
    switch (errorCode) {
      case 0:
        var message = window.constants.HTTP_ERRORS.unreachable;
        break;
      case 400:
        message = window.constants.HTTP_ERRORS.badRequest;
        break;
      case 401:
        message = window.constants.HTTP_ERRORS.unauthorized;
        break;
      case 403:
        message = window.constants.HTTP_ERRORS.forbidden;
        break;
      case 404:
        message = window.constants.HTTP_ERRORS.notFound;
        break;
      case 408:
        message = window.constants.HTTP_ERRORS.requestTimeout;
        break;
      case 429:
        message = window.constants.HTTP_ERRORS.tooManyRequests;
        break;
      case 500:
        message = window.constants.HTTP_ERRORS.internalServerError;
        break;
      case 502:
        message = window.constants.HTTP_ERRORS.badGateway;
        break;
      case 503:
        message = window.constants.HTTP_ERRORS.serviceUnavailable;
        break;
      case 504:
        message = window.constants.HTTP_ERRORS.gatewayTimeout;
        break;
      case 524:
        message = window.constants.HTTP_ERRORS.aTimeoutOccured;
        break;
      default:
        message = 'Неизвестная ошибка. HTTP код: ' + errorCode;
        break;
    }

    return message;
  }

  /**
  * Закрытие (удаление) модального окна с HTTP ошибкой и отключение связанных слушателей.
  *
  * @function onErrorModalCloseButtonPress
  */
  function onErrorModalCloseButtonPress() {
    var errorModal = window.constants.MAP.querySelector('.error-modal');
    var errorCloseButton = errorModal.querySelector('button');

    errorModal.parentNode.removeChild(errorModal);
    errorCloseButton.removeEventListener('click', onErrorModalCloseButtonPress);
  }
})();
