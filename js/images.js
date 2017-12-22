'use strict';

/*
***********************************************************************************
***********************************************************************************
***
***                 МОДУЛЬ ЗАГРУЗКИ ПОЛЬЗОВАТЕЛЬСКИХ ИЗОБРАЖЕНИЙ:
***                         (АВАТАРА, ФОТОГРАФИЙ ЖИЛИЩА)
***
***********************************************************************************
***********************************************************************************
*/

(function () {

  var avatarInput = window.constants.USER_AVATAR_INPUT;
  var avatarPreview = window.constants.USER_AVATAR_PREVIEW;
  avatarInput.addEventListener('change', function () {
    checkAndRenderImage(avatarInput);
  });

  var propertyImageInput = window.constants.USER_PROPERTY_IMAGE_INPUT;
  var propertyImageContainer = window.constants.USER_PROPERTY_IMAGE_CONTAINER;
  propertyImageInput.addEventListener('change', function () {
    checkAndRenderImage(propertyImageInput);
  });

  /**
  * Проверка на соответствие типу "изображение",
  * обработка и отрисовка загруженных изображений на странице.
  *
  * @function checkAndRenderImage
  * @param {node} target — target type file: avatarInput или propertyImageInput
  */
  function checkAndRenderImage(target) {
    var image = target.files[0];
    var imageName = image.name.toLowerCase();

    // Проверка загруженного файла на наличие в конце
    // названия ключевых расширений .jpg, .jpeg, .gif, .png
    var match = window.constants.IMAGE_TYPES.some(function (authorizedType) {
      return imageName.endsWith(authorizedType);
    });

    // Если совпадение есть — загрузка и отрисовка превью
    if (match) {
      var fileReader = new FileReader();

      fileReader.addEventListener('load', function () {

        // Если файл загружен в поле для аватара:
        if (target === avatarInput) {
          avatarPreview.src = fileReader.result;

          // Если файл загружен в поле для фотографий жилища
        } else if (target === propertyImageInput) {
          var propertyImagePreview = document.createElement('img');

          propertyImagePreview.src = fileReader.result;
          propertyImagePreview.width = window.constants.USER_PROPERTY_IMAGE_WIDTH;

          propertyImageContainer.appendChild(propertyImagePreview);
        }
      });

      fileReader.readAsDataURL(image);
    }
  }
})();
