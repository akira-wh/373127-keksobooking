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
    errorText.textContent = window.constants.HTTP_ERRORS.decode(errorCode);
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
