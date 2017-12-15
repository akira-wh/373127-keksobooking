'use strict';

/*
***********************************************************************************
***********************************************************************************
***
***                   УСТАНОВКА НЕОБХОДИМЫХ СВОЙСТВ ПО УМОЛЧАНИЮ
***                         ДЛЯ ФОРМЫ СОЗДАНИЯ ОБЪЯВЛЕНИЙ
***
***********************************************************************************
***********************************************************************************
*/

/**
* Приведение формы создания объявлений к необходимомму состоянию по умолчанию.
* fieldset'ы формы заблокированы, форме установлен ACTION="" и другие default атрибуты
*
* @function setUserFormDefaultState
*/
(function setUserFormDefaultState() {
  window.constants.USER_FORM.action = 'https://js.dump.academy/keksobooking';

  var fieldsets = window.constants.USER_FORM.querySelectorAll('fieldset');
  var fieldsetsNumber = fieldsets.length;

  for (var i = 0; i < fieldsetsNumber; i++) {
    fieldsets[i].disabled = true;
  }

  var inputTitle = window.constants.USER_FORM.querySelector('input#title');
  inputTitle.minLength = '30';
  inputTitle.maxLength = '100';
  inputTitle.required = true;

  var inputAddress = window.constants.USER_FORM.querySelector('input#address');
  inputAddress.value = '375, 600'; // default координаты управляющего пина (центр, центр)
  inputAddress.readOnly = true;
  inputAddress.tabIndex = -1;

  var inputPropertyPrice = window.constants.USER_FORM.querySelector('input#price');
  inputPropertyPrice.placeholder = '1000';
  inputPropertyPrice.min = '1000';
  inputPropertyPrice.max = '1000000';
  inputPropertyPrice.required = true;

  var selectPropertyCapacity = window.constants.USER_FORM.querySelector('select#capacity');
  selectPropertyCapacity.selectedIndex = 2;
})();
