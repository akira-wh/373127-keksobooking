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

    /*
    ***********************************************************************************
    ***********************************************************************************
    ***
    ***                             НЕТЕМАТИЧЕСКИЕ КОНСТАНТЫ
    ***
    ***********************************************************************************
    ***********************************************************************************
    */

    // Объект — Типы жилья (ключи и расшифровки)
    // Используется для русификации типа жилья при отрисовке карт
    OFFERS_PROPERTY_TYPES: {
      flat: 'Квартира',
      house: 'Дом',
      bungalo: 'Бунгало'
    },

    // Стандартная задерка для дебаунса (в милисекундах)
    DEBOUNCE_DELAY: 500,

    // Один из фирменных цветов сайта,
    // используется при отрисовке сообщения о HTTP ошибке
    COLOR_ORANGE: '#ff5635',

    // Коды клавиш
    ESC_KEYCODE: 27,
    ENTER_KEYCODE: 13,

    /*
    ***********************************************************************************
    ***********************************************************************************
    ***
    ***                                   ЭЛЕМЕНТЫ КАРТЫ
    ***
    ***********************************************************************************
    ***********************************************************************************
    */

    // Карта пинов и объявлений
    MAP: document.querySelector('.map'),

    // Контейнер, содержащий все пины
    PINS_CONTAINER: document.querySelector('.map__pins'),

    // Центровка пинов (кроме управляющего) по X и Y (в px)
    PIN_SHIFT_X: 23,
    PIN_SHIFT_Y: 64,

    // Максимальное количество выводимых на страницу пинов
    PINS_MAX_LIMIT: 5,

    // Управляющий пользовательский пин
    CONTROL_PIN: document.querySelector('.map__pin--main'),

    // Центровка управляющего пина по Y (в px)
    CONTROL_PIN_SHIFT_Y: 45,
    CONTROL_PIN_BASE_COORDS_X: '600px',
    CONTROL_PIN_BASE_COORDS_Y: '375px',

    // Ограничение координат управляющего пина
    // Необходимо во избежание вылета пина за пределы карты
    COORDS_MIN_LIMIT_X: 0,
    COORDS_MAX_LIMIT_X: 1200,
    COORDS_MIN_LIMIT_Y: 55,
    COORDS_MAX_LIMIT_Y: 455,

    // Точка размещения открытых объявлений
    // (место в разметке для appendChild(card))
    CARD_PLACEMENT: document.querySelector('.map__filters-container'),

    // z-index для открытых объявлений,
    // исключающий наслоение на них других элементов
    CARD_DOMINANCE_Z_INDEX: 100,

    // Тип недвижимости по умолчанию для объявлений.
    CARD_DEFAULT_PROPERTY_TYPE: 'Тип недвижимости не определен',

    // Ограничение ширины фотографий в объявлениях
    // Необходимо, чтобы фото не вываливались из контейнера
    CARD_PHOTO_WIDTH: 70,

    // Фильтры объявлений (10 шт.)
    FILTERS: document.querySelectorAll('.map__filters select, .map__filters input'),

    // Количество лишних первых символов (лишний префикс)
    // в строке с названием ID объекта.
    // Используется при substring(), чтобы привести,
    // например, "housing-type" к "type".
    // Используется при фильтрации.
    ID_USELESS_PREFIX: 8,

    // Шаблоны элементов
    PIN_TEMPLATE: document.querySelector('template').content.querySelector('.map__pin'),
    CARD_TEMPLATE: document.querySelector('template').content.querySelector('.map__card'),


    /*
    ***********************************************************************************
    ***********************************************************************************
    ***
    ***                       ЭЛЕМЕНТЫ ФОРМЫ СОЗДАНИЯ ОБЪЯВЛЕНИЙ
    ***
    ***********************************************************************************
    ***********************************************************************************
    */

    // Форма создания объявлений
    FORM: document.querySelector('.notice__form'),

    // Action URL формы
    FORM_ACTION_DEFAULT_URL: 'https://js.dump.academy/keksobooking',

    // Элементы формы
    FORM_FIELDSETS: document.querySelectorAll('.notice__form fieldset'),
    FORM_TITLE: document.querySelector('input#title'),
    FORM_ADDRESS: document.querySelector('input#address'),
    FORM_PRICE: document.querySelector('input#price'),
    FORM_CAPACITY: document.querySelector('select#capacity'),
    FORM_DESCRIPTION: document.querySelector('textarea#description'),
    FORM_CHECKIN: document.querySelector('select#timein'),
    FORM_CHECKOUT: document.querySelector('select#timeout'),
    FORM_TYPE: document.querySelector('select#type'),
    FORM_ROOMS_NUMBER: document.querySelector('select#room_number'),
    FORM_RESET_BUTTON: document.querySelector('button.form__reset'),

    // tabindex, при котором поле "адрес" становится недоступным для фокуса
    FORM_EXCLUDING_TABINDEX: -1,

    // Базовые значения элементов формы
    FORM_TITLE_DEFAULT_MIN_LENGTH: 30,
    FORM_TITLE_DEFAULT_MAX_LENGTH: 100,
    FORM_ADDRESS_DEFAULT_VALUE: 'x: 600, y: 420',
    FORM_PRICE_DEFAULT_PLACEHOLDER: 1000,
    FORM_PRICE_DEFAULT_MIN_VALUE: 1000,
    FORM_PRICE_DEFAULT_MAX_VALUE: 1000000,
    FORM_CAPACITY_DEFAULT_OPTION: 2,
    FORM_DESCRIPTION_DEFAULT_PLACEHOLDER:
        'Здесь расскажите о том, какое ваше жилье замечательное и вообще',

    // Аватар и изображения жилья пользователя в форме
    USER_AVATAR_INPUT: document.querySelector('input#avatar'),
    USER_AVATAR_DROPZONE: document.querySelector('.notice__photo .drop-zone'),
    USER_AVATAR_PREVIEW: document.querySelector('.notice__preview img'),
    USER_AVATAR_DEFAULT_PREVIEW: 'img/muffin.png',
    USER_PROPERTY_IMAGE_INPUT: document.querySelector('input#images'),
    USER_PROPERTY_IMAGE_CONTAINER: document.querySelector('.form__photo-container'),
    USER_PROPERTY_IMAGE_WIDTH: 140,
    IMAGE_TYPES: ['jpg', 'jpeg', 'gif', 'png'],
    IMAGE_MIME_TYPES: 'image/jpeg,image/png,image/gif',

    /*
    ***********************************************************************************
    ***********************************************************************************
    ***
    ***                           БИБЛИОТЕКА ОШИБОК ВАЛИДАЦИИ,
    ***                             МЕДОТЫ РАБОТЫ С ОШИБКАМИ
    ***
    ***********************************************************************************
    ***********************************************************************************
    */

    INPUT_ERRORS: {
      valueMissing: 'Это поле не должно быть пустым.',
      valueShort: 'Минимально допустимая длина: 30 символов. Сейчас: ',
      valueLong: 'Максимально допустимая длина: 100 символов. Сейчас: ',
      rangeUnderflow: 'Минимально допустимое значение: ',
      rangeOverflow: 'Максимально допустимое значение: ',
      badInput: 'Неверный формат ввода: допустимы только числа.',

      // Возврат динамически составленной ошибки "Значение слишком короткое"
      getValueShortDynamicError: function (currentLength) {
        return this.valueShort + currentLength + '.';
      },
      // Возврат динамически составленной ошибки "Значение слишком длинное"
      getValueLongDynamicError: function (currentLength) {
        return this.valueLong + currentLength + '.';
      },
      // Возврат динамически составленной ошибки "Число меньше допустимого минимума"
      getRangeUnderflowDynamicError: function (currentLimit) {
        return this.rangeUnderflow + currentLimit + '.';
      },
      // Возврат динамически составленной ошибки "Число больше допустимого максимума"
      getRangeOverflowDynamicError: function (currentLimit) {
        return this.rangeOverflow + currentLimit + '.';
      }
    },

    /*
    ***********************************************************************************
    ***********************************************************************************
    ***
    ***                           КОНСТАНТЫ ДЛЯ РАБОТЫ С СЕТЬЮ
    ***             СТАТУСЫ, БИБЛИОТЕКА ОШИБОК, МЕТОДЫ РАБОТЫ С ОШИБКАМИ etc.
    ***
    ***********************************************************************************
    ***********************************************************************************
    */

    // HTTP код SUCCESS/OK/УСПЕХ
    HTTP_STATUS_OK: 200,

    // Лимит ожидания ответа от сервера (10 секунд)
    HTTP_TIMEOUT_LIMIT: 10000,

    // URL сервера для получения данных
    SERVER_DOWNLOAD_URL: 'https://1510.dump.academy/keksobooking/data',

    // URL сервера для отправки данных
    SERVER_UPLOAD_URL: 'https://1510.dump.academy/keksobooking',

    // Библиотека HTTP ошибок и методы работы с ними
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
       * Сборка и отображение модального окна с сообщением о HTTP ошибке.
       * Добавление слушателя на кнопку ЗАКРЫТЬ (закрытие).
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
       * @param {number} errorCode — код HTTP ошибки
       * @return {string} — расшифрованное и русифицированное сообщение об ошибке
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
       * Закрытие (удаление) модального окна с HTTP ошибкой,
       * отключение связанных слушателей (нажатие кнопки "Закрыть").
       *
       * @method onErrorModalCloseButtonPress
       * @param {object} evt — объект события (click)
       */
      onErrorModalCloseButtonPress: function (evt) {
        evt.target.parentNode.remove();
        evt.target.removeEventListener('click', this.onErrorModalCloseButtonPress);
      }
    }
  };
})();
