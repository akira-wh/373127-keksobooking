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
  var preview = window.constants.USER_AVATAR_PREVIEW;

  avatarInput.addEventListener('change', function () {
    var image = avatarInput.files[0];
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
        preview.src = fileReader.result;
      });

      fileReader.readAsDataURL(image);
    }
  });
})();
