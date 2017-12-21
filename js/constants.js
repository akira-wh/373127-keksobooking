'use strict';

/*
***********************************************************************************
***********************************************************************************
***
***                     КОНСТАНТЫ, ГЛОБАЛЬНЫЕ ОБЪЕКТЫ, МАССИВЫ
***
***********************************************************************************
***********************************************************************************
*/

(function () {

  window.constants = {

    // Цвета
    COLOR_ORANGE: '#ff5635',

    // Коды клавиш
    ESC_KEYCODE: 27,

    // Смещение всех пинов (кроме управляющего) по X и Y (в px)
    PIN_SHIFT_X: 5,
    PIN_SHIFT_Y: 37,

    // Карта пинов и объявлений
    MAP: document.querySelector('.map'),

    // Контейнер пинов
    PINS_CONTAINER: document.querySelector('.map__pins'),

    // Максимальное количество выводимых на страницу пинов-объявлений
    PINS_MAX_LIMIT: 5,

    // Управляющий пользовательский пин
    CONTROL_PIN: document.querySelector('.map__pin--main'),

    // Смещение управляющего пина по Y (в px)
    CONTROL_PIN_SHIFT_Y: 45,

    // Ограничения координат управляющего пина
    COORDS_MIN_LIMIT_X: 0,
    COORDS_MAX_LIMIT_X: 1200,
    COORDS_MIN_LIMIT_Y: 110,
    COORDS_MAX_LIMIT_Y: 655,

    // Фильтры объявлений
    FILTERS: document.querySelectorAll('.map__filters select, .map__filters input'),

    // Количество ненужных символов (префикс) в строке с названием ключа объекта
    // Используется при .substring, чтобы привести, например, "housing-type" к "type"
    USELESS_PREFIX_CHARS: 8,

    // Форма создания объявлений
    FORM: document.querySelector('.notice__form'),

    // Form Action Url
    FORM_ACTION_URL: 'https://js.dump.academy/keksobooking',

    // Объект — Типы жилья (ключи и расшифровки)
    OFFERS_PROPERTY_TYPES: {
      flat: 'Квартира',
      house: 'Дом',
      bungalo: 'Бунгало'
    },

    // Библиотека и методы расшифровки ошибок валидации формы
    INPUT_ERRORS: {
      valueMissing: 'Это поле не должно быть пустым.',
      valueShort: 'Минимально допустимая длина: 30 символов. Сейчас: ',
      valueLong: 'Максимально допустимая длина: 100 символов. Сейчас: ',
      rangeUnderflow: 'Минимально допустимое значение: ',
      rangeOverflow: 'Максимально допустимое значение: ',
      badInput: 'Неверный формат ввода: допустимы только числа.',

      // Выдача динамически составленной ошибки "Значение слишком короткое"
      getValueShortDynamicError: function (currentLength) {
        return this.valueShort + currentLength + '.';
      },
      // Выдача динамически составленной ошибки "Значение слишком длинное"
      getValueLongDynamicError: function (currentLength) {
        return this.valueLong + currentLength + '.';
      },
      // Выдача динамически составленной ошибки "Число меньше допустимого минимума"
      getRangeUnderflowDynamicError: function (currentLimit) {
        return this.rangeUnderflow + currentLimit + '.';
      },
      // Выдача динамически составленной ошибки "Число больше допустимого максимума"
      getRangeOverflowDynamicError: function (currentLimit) {
        return this.rangeOverflow + currentLimit + '.';
      }
    },

    // HTTP код SUCCESS/УСПЕХ
    HTTP_STATUS_OK: 200,

    // Предел ожидания ответа от сервера (10 секунд)
    HTTP_TIMEOUT_LIMIT: 10000,

    // URL сервера для получения данных объявлений
    SERVER_DOWNLOAD_URL: 'https://1510.dump.academy/keksobooking/data',

    // URL сервера для отправки данных из формы
    SERVER_UPLOAD_URL: 'https://1510.dump.academy/keksobooking',

    // Библиотека и метод расшифровки HTTP ошибок
    HTTP_ERRORS: {
      unreachable: 'Невозможно установить соединение с сервером.',
      badRequest: 'Неверный запрос.',
      unauthorized: 'Пользователь не авторизован.',
      forbidden: 'Запрос отклонен (запрещено).',
      notFound: 'Данные не найдены.',
      requestTimeout: 'Истекло время ожидания ответа.',
      tooManyRequests: 'Слишком много запросов.',
      internalServerError: 'Внутренняя ошибка сервера.',
      badGateway: 'Неверный шлюз.',
      serviceUnavailable: 'Сервис недоступен.',
      gatewayTimeout: 'Шлюз не отвечает.',
      aTimeoutOccured: 'Время ожидания истекло.',
      default: 'Неизвестная ошибка. HTTP код: ',

      /**
       * Сборка и показ модального окна с сообщением о HTTP ошибке.
       * Добавление слушателя на кнопку ЗАКРЫТЬ.
       *
       * @method showModal
       * @param {number} errorCode — код HTTP ошибки
       */
      showModal: function (errorCode) {
        var errorModal = document.createElement('div');
        errorModal.className = 'error-modal';
        errorModal.style.width = '200px';
        errorModal.style.padding = '30px';
        errorModal.style.position = 'fixed';
        errorModal.style.left = '50%';
        errorModal.style.top = '50%';
        errorModal.style.border = 'solid 5px ' + window.constants.COLOR_ORANGE;
        errorModal.style.borderRadius = '5px';
        errorModal.style.transform = 'translate(-50%, -50%)';
        errorModal.style.zIndex = '100';
        errorModal.style.backgroundColor = 'white';
        errorModal.style.textAlign = 'center';
        errorModal.style.fontWeight = 'bold';
        errorModal.style.boxShadow = '0px 4px 20px 0px rgba(0,0,0,0.7)';

        var errorText = document.createElement('p');
        errorText.textContent = this.decode(errorCode);
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

        var body = document.querySelector('body');
        body.appendChild(errorModal);
        errorCloseButton.addEventListener('click', this.onErrorModalCloseButtonPress);
      },

      /**
       * Расшифровка кода HTTP ошибок.
       *
       * @method decode
       * @param {number} errorCode — код ошибки
       * @return {string} — расшифрованное сообщение об ошибке
       */
      decode: function (errorCode) {
        switch (errorCode) {
          case 0:
            var message = this.unreachable;
            break;
          case 400:
            message = this.badRequest;
            break;
          case 401:
            message = this.unauthorized;
            break;
          case 403:
            message = this.forbidden;
            break;
          case 404:
            message = this.notFound;
            break;
          case 408:
            message = this.requestTimeout;
            break;
          case 429:
            message = this.tooManyRequests;
            break;
          case 500:
            message = this.internalServerError;
            break;
          case 502:
            message = this.badGateway;
            break;
          case 503:
            message = this.serviceUnavailable;
            break;
          case 504:
            message = this.gatewayTimeout;
            break;
          case 524:
            message = this.aTimeoutOccured;
            break;
          default:
            message = this.default + errorCode;
            break;
        }

        return message;
      },

      /**
       * Закрытие (удаление) модального окна с HTTP ошибкой и отключение связанных слушателей.
       *
       * @method onErrorModalCloseButtonPress
       */
      onErrorModalCloseButtonPress: function () {
        var errorModal = document.querySelector('.error-modal');
        var errorCloseButton = errorModal.querySelector('button');

        errorModal.parentNode.removeChild(errorModal);
        errorCloseButton.removeEventListener('click', this.onErrorModalCloseButtonPress);
      }
    }
  };
})();
