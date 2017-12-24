'use strict';

/*
***********************************************************************************
***********************************************************************************
***
***                    ЗАГРУЗКА ПОЛЬЗОВАТЕЛЬСКИХ ИЗОБРАЖЕНИЙ:
***                         (АВАТАРА, ФОТОГРАФИЙ ЖИЛИЩА)
***
***********************************************************************************
***********************************************************************************
*/

(function () {

  // Проверка и отображение фотографий при загрузке
  window.constants.USER_AVATAR_INPUT.addEventListener('change', function () {
    checkAndRenderImage(window.constants.USER_AVATAR_INPUT);
  });

  window.constants.USER_PROPERTY_IMAGE_INPUT.addEventListener('change', function () {
    checkAndRenderImage(window.constants.USER_PROPERTY_IMAGE_INPUT);
  });

  /**
  * Проверка на соответствие типу "изображение",
  * обработка и отрисовка загруженных изображений на странице.
  *
  * @function checkAndRenderImage
  * @param {node} target — target type file: USER_AVATAR_INPUT или USER_PROPERTY_IMAGE_INPUT
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
        if (target === window.constants.USER_AVATAR_INPUT) {
          window.constants.USER_AVATAR_PREVIEW.src = fileReader.result;

          // Если файл загружен в поле для фотографий жилища:
        } else if (target === window.constants.USER_PROPERTY_IMAGE_INPUT) {
          var propertyImagePreview = document.createElement('img');

          propertyImagePreview.src = fileReader.result;
          propertyImagePreview.width = window.constants.USER_PROPERTY_IMAGE_WIDTH;

          window.constants.USER_PROPERTY_IMAGE_CONTAINER.appendChild(propertyImagePreview);
        }
      });

      fileReader.readAsDataURL(image);
    }
  }
})();
