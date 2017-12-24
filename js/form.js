'use strict';

/*
***********************************************************************************
***********************************************************************************
***
***                             ФОРМА СОЗДАНИЯ ОБЪЯВЛЕНИЙ:
***     ПРИВЕДЕНИЕ К СОСТОЯНИЮ ПО УМОЛЧАНИЮ, АКТИВАЦИЯ ВМЕСТЕ С ДОП.СЕРВИСАМИ
***
***********************************************************************************
***********************************************************************************
*/

(function () {

  window.form = {

    /**
     * Приведение формы к необходимомму состоянию по умолчанию.
     * Форме устанавливается action url и прочие default атрибуты.
     * Данный метод запускается при загрузке сайта, а также
     * после отправки формы на сервер (сброс).
     *
     * @method setDefaults
     */
    setDefaults: function () {
      window.constants.FORM.action = window.constants.FORM_ACTION_DEFAULT_URL;
      window.constants.USER_AVATAR_INPUT.accept = window.constants.IMAGE_MIME_TYPES;
      window.constants.USER_PROPERTY_IMAGE_INPUT.accept = window.constants.IMAGE_MIME_TYPES;

      // default для поля "Заголовок объявления"
      window.constants.FORM_TITLE.value = '';
      window.constants.FORM_TITLE.minLength = window.constants.FORM_TITLE_DEFAULT_MIN_LENGTH;
      window.constants.FORM_TITLE.maxLength = window.constants.FORM_TITLE_DEFAULT_MAX_LENGTH;
      window.constants.FORM_TITLE.required = true;

      // default для поля "Адрес"
      // сброс адреса ведет к возвращению управляющего пина на исходные координаты
      window.constants.FORM_ADDRESS.value = window.constants.FORM_ADDRESS_DEFAULT_VALUE;
      window.constants.FORM_ADDRESS.readOnly = true;
      window.constants.FORM_ADDRESS.tabIndex = window.constants.FORM_EXCLUDING_TABINDEX;
      window.constants.CONTROL_PIN.style.left = window.constants.CONTROL_PIN_BASE_COORDS_X;
      window.constants.CONTROL_PIN.style.top = window.constants.CONTROL_PIN_BASE_COORDS_Y;

      // default для поля "Цена за ночь"
      window.constants.FORM_PRICE.value = '';
      window.constants.FORM_PRICE.placeholder = window.constants.FORM_PRICE_DEFAULT_PLACEHOLDER;
      window.constants.FORM_PRICE.min = window.constants.FORM_PRICE_DEFAULT_MIN_VALUE;
      window.constants.FORM_PRICE.max = window.constants.FORM_PRICE_DEFAULT_MAX_VALUE;
      window.constants.FORM_PRICE.required = true;

      // default для поля "Количество мест"
      window.constants.FORM_CAPACITY.selectedIndex = window.constants.FORM_CAPACITY_DEFAULT_OPTION;

      // default для поля "Описание"
      window.constants.FORM_DESCRIPTION.value = '';
      window.constants.FORM_DESCRIPTION.placeholder = window.constants.FORM_DESCRIPTION_DEFAULT_PLACEHOLDER;
    },

    /**
     * Активация формы, контроль синхронизации и валидности.
     *
     * Удаление блокирующего класса .notice__form--disabled,
     * снятие у всех fieldset флага disabled.
     * По синхронизации и валидации см.их комментарии к ним.
     *
     * @method activate
     */
    activate: function () {

      // Активация формы и fieldset'ов
      window.constants.FORM.classList.remove('notice__form--disabled');
      setFieldsetsAvailability(true);

      // Контроль синхронизации между зависимыми полями:
      // "Время заезда и выезда"
      window.constants.FORM_CHECKIN.addEventListener('change', function () {
        window.synchronizeFields(window.constants.FORM_CHECKIN, window.constants.FORM_CHECKOUT, syncTimes);
      });
      window.constants.FORM_CHECKOUT.addEventListener('change', function () {
        window.synchronizeFields(window.constants.FORM_CHECKOUT, window.constants.FORM_CHECKIN, syncTimes);
      });

      // "Тип жилья", "Цена за ночь"
      window.constants.FORM_TYPE.addEventListener('change', function () {
        window.synchronizeFields(window.constants.FORM_TYPE, window.constants.FORM_PRICE, syncPropertyPrice);
      });

      // "Количество комнат и мест"
      window.constants.FORM_ROOMS_NUMBER.addEventListener('change', function () {
        window.synchronizeFields(window.constants.FORM_ROOMS_NUMBER, window.constants.FORM_CAPACITY, syncPropertyCapacity);
      });

      // Контроль вводимых данных на валидность
      window.constants.FORM_TITLE.addEventListener('invalid', function (evt) {
        window.validation.onInvalidInput(evt);
        window.constants.FORM_TITLE.addEventListener('input', window.validation.onInvalidInput);
      });
      window.constants.FORM_PRICE.addEventListener('invalid', function (evt) {
        window.validation.onInvalidInput(evt);
      });

      // Отправка данных формы на сервер
      window.constants.FORM.addEventListener('submit', onFormSubmit);

      // Обнуление формы до необходимых default-значений
      window.constants.FORM_RESET_BUTTON.addEventListener('click', function (evt) {
        evt.preventDefault();

        cleanupUserImages();
        window.constants.FORM.reset();
        window.form.setDefaults();
      });
    }
  };

  /*
  ***********************************************************************************
  ***********************************************************************************
  ***
  ***                    ПРИВЕДЕНИЕ ФОРМЫ К СОСТОЯНИЮ ПО УМОЛЧАНИЮ
  ***                             НА МОМЕНТ ЗАГРУЗКИ САЙТА
  ***
  ***********************************************************************************
  ***********************************************************************************
  */

  setFieldsetsAvailability(false);
  window.form.setDefaults();

  /*
  ***********************************************************************************
  ***********************************************************************************
  ***
  ***                             ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
  ***
  ***********************************************************************************
  ***********************************************************************************
  */

  /**
   * Активация/деактивация всех fieldset формы.
   *
   * @function setFieldsetsAvailability
   * @param {boolean} booleanStatus — true, чтобы включить / false, чтобы выключить
   */
  function setFieldsetsAvailability(booleanStatus) {
    var fieldsetsNumber = window.constants.FORM_FIELDSETS.length;

    for (var i = 0; i < fieldsetsNumber; i++) {
      window.constants.FORM_FIELDSETS[i].disabled = !booleanStatus;
    }
  }

  /**
   * Синхронизация селектов "Время заезда и выезда" по индексу опций.
   *
   * @function syncTimes
   * @param {node} syncSource — select, источник изменений
   * @param {node} syncTarget — синхронизируемый select
   */
  function syncTimes(syncSource, syncTarget) {
    syncTarget.selectedIndex = syncSource.selectedIndex;
  }

  /**
   * Синхронизация селекта "Тип жилья" с подсказкой и ограничениями в "Цена за ночь".
   *
   * @function syncPropertyPrice
   * @param {node} syncSource — select, источник изменений
   * @param {node} syncTarget — синхронизируемый input
   */
  function syncPropertyPrice(syncSource, syncTarget) {
    switch (syncSource.selectedIndex) {
      case 0: // Лачуга
        syncTarget.placeholder = 0; // Стоимость 0
        syncTarget.min = 0;
        break;
      case 1: // Квартира
        syncTarget.placeholder = 1000; // Стоимость 1.000
        syncTarget.min = 1000;
        break;
      case 2: // Дом
        syncTarget.placeholder = 5000; // Стоимость 5.000
        syncTarget.min = 5000;
        break;
      case 3: // Дворец
        syncTarget.placeholder = 10000; // Стоимость 10.000
        syncTarget.min = 10000;
        break;
    }
  }

  /**
   * Синхронизация опций селектов "Количество комнат" и "Количество мест".
   *
   * @function syncPropertyCapacity
   * @param {node} syncSource — select, источник изменений
   * @param {node} syncTarget — синхронизируемый select
   */
  function syncPropertyCapacity(syncSource, syncTarget) {
    switch (syncSource.selectedIndex) {
      case 0: // 1 комната
        syncTarget.selectedIndex = 2; // для 1 гостя
        break;
      case 1: // 2 комнаты
        syncTarget.selectedIndex = 1; // для 2-х гостей
        break;
      case 2: // 3 комнаты
        syncTarget.selectedIndex = 0; // для 3-х гостей
        break;
      case 3: // 100 комнат
        syncTarget.selectedIndex = 3; // не для гостей
        break;
    }
  }

  /**
  * Очистка загруженных пользователем фотографий
  *
  * @function cleanupUserImages
  */
  function cleanupUserImages() {
    window.constants.USER_AVATAR_PREVIEW.src = window.constants.USER_AVATAR_DEFAULT_PREVIEW;

    var propertyImages = window.constants.USER_PROPERTY_IMAGE_CONTAINER.querySelectorAll('img');
    var propertyImagesNumber = propertyImages.length;

    for (var i = 0; i < propertyImagesNumber; i++) {
      propertyImages[i].parentNode.removeChild(propertyImages[i]);
    }
  }

  /**
   * Альтернативный метод отправки данных формы на сервер.
   *
   * @function onFormSubmit
   * @param {object} evt — объект события, submit
   */
  function onFormSubmit(evt) {
    evt.preventDefault();

    var formData = new FormData(window.constants.FORM);
    window.backend.save(formData, onLoad, onError);
  }

  /**
   * Callback при успешной отправке данных формы на сервер:
   * возвращение к значениям по умолчанию.
   *
   * @function onLoad
   */
  function onLoad() {
    cleanupUserImages();
    window.constants.FORM.reset();
    window.form.setDefaults();
  }

  /**
   * Callback при получении HTTP ошибки:
   * расшифровка ошибки и оповещения клиента.
   *
   * @function onError
   * @param {number} errorCode — HTTP код ошибки
   */
  function onError(errorCode) {
    window.constants.HTTP_ERRORS.showModal(errorCode);
  }
})();
