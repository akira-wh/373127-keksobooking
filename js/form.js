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
     * Приведение формы создания объявлений к необходимомму состоянию по умолчанию.
     * Форме устанавливается action url и прочие default атрибуты.
     * Метод запускается при загрузке сайта и при обнулении формы после отправки.
     *
     * @method setDefaults
     */
    setDefaults: function () {
      window.constants.FORM.action = window.constants.FORM_ACTION_URL;

      var inputTitle = window.constants.FORM.querySelector('input#title');
      inputTitle.value = '';
      inputTitle.minLength = 30;
      inputTitle.maxLength = 100;
      inputTitle.required = true;

      var inputAddress = window.constants.FORM.querySelector('input#address');
      inputAddress.value = 'x: 600, y: 420';
      inputAddress.readOnly = true;
      inputAddress.tabIndex = -1;

      var inputPropertyPrice = window.constants.FORM.querySelector('input#price');
      inputPropertyPrice.value = '';
      inputPropertyPrice.placeholder = 1000;
      inputPropertyPrice.min = 1000;
      inputPropertyPrice.max = 1000000;
      inputPropertyPrice.required = true;

      var selectPropertyCapacity = window.constants.FORM.querySelector('select#capacity');
      selectPropertyCapacity.selectedIndex = 2;

      var textareaDescription = window.constants.FORM.querySelector('textarea#description');
      textareaDescription.value = '';
      textareaDescription.placeholder = 'Здесь расскажите о том, какое ваше жилье замечательное и вообще';
    },

    /**
     * Активация формы создания объявлений, контроль синхронизации и валидности.
     *
     * Удаление у <form> блокирующего класса .notice__form--disabled, активация fieldset.
     * По синхронизации и валидации см.документацию связанных функций.
     *
     * @method activate
     */
    activate: function () {
      // Активация формы и fieldset'ов
      window.constants.FORM.classList.remove('notice__form--disabled');
      setFieldsetsAvailability(true);

      // Контроль синхронизации между зависимыми полями:
      // "Тип жилья", "Цена за ночь", "Время заезда и выезда", "Количество комнат и мест"
      var selectCheckin = window.constants.FORM.querySelector('select#timein');
      var selectCheckout = window.constants.FORM.querySelector('select#timeout');
      selectCheckin.addEventListener('change', function () {
        window.synchronizeFields(selectCheckin, selectCheckout, syncTimes);
      });
      selectCheckout.addEventListener('change', function () {
        window.synchronizeFields(selectCheckout, selectCheckin, syncTimes);
      });

      var selectPropertyType = window.constants.FORM.querySelector('select#type');
      var inputPropertyPrice = window.constants.FORM.querySelector('input#price');
      selectPropertyType.addEventListener('change', function () {
        window.synchronizeFields(selectPropertyType, inputPropertyPrice, syncPropertyPrice);
      });

      var selectRoomsNumber = window.constants.FORM.querySelector('select#room_number');
      var selectPropertyCapacity = window.constants.FORM.querySelector('select#capacity');
      selectRoomsNumber.addEventListener('change', function () {
        window.synchronizeFields(selectRoomsNumber, selectPropertyCapacity, syncPropertyCapacity);
      });

      // Контроль вводимых данных на валидность
      var inputTitle = window.constants.FORM.querySelector('input#title');
      var inputPrice = window.constants.FORM.querySelector('input#price');
      inputTitle.addEventListener('input', window.validation.onInvalidInput);
      inputTitle.addEventListener('invalid', window.validation.onInvalidInput);
      inputPrice.addEventListener('input', window.validation.onInvalidInput);
      inputPrice.addEventListener('invalid', window.validation.onInvalidInput);

      // Отправка данных формы на сервер
      window.constants.FORM.addEventListener('submit', onFormSubmit);
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
    var fieldsets = window.constants.FORM.querySelectorAll('fieldset');
    var fieldsetsNumber = fieldsets.length;

    for (var i = 0; i < fieldsetsNumber; i++) {
      fieldsets[i].disabled = !booleanStatus;
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
   * Альтернативный вариант отправки данных формы на сервер.
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
   * Возвращение к значениям по умолчанию.
   *
   * @function onLoad
   */
  function onLoad() {
    window.form.setDefaults();
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
