$(document).ready(() => {
  // ---- login popup toggle
  $(".login-popup, .modal-close").click((e) => {
    e.preventDefault();
    $(".modal-wrapper").toggleClass("show");
  });

  // ----- login request
  $(".loginform").submit((e) => {
    e.preventDefault();
    const nickname = $("#nickname").val();
    const password = $("#password").val();
    const csrf = $("#csrf").val();

    if (nickname === "" || password === "") {
      $(".message").text("Заполните поля");
    } else {
      $.ajax({
        url: "/signin",
        type: "POST",
        data: { _csrf: csrf, nickname, password },
        success: (res) => {
          if (res.success) window.location.reload();
          $(".message").text(res.message);
        }
      });
    }
  });


  //-----------------------------------
  $(".signupform").validate({
    rules: {
      nickname: {
        required: true,
        remote: {
          type: "POST",
          url: "/validate",
          dataType: "text",
          data: {
            _csrf: $("#csrf").val(),
            valid: "nickname",
            nickname: () => { $("#nickname").val(); }
          }
        }
      },
      email: {
        required: true,
        email: true,
        remote: {
          type: "POST",
          url: "/validate",
          dataType: "text",
          data: {
            _csrf: $("#csrf").val(),
            valid: "email",
            email: () => { $("#email").val(); }
          }
        }
      },
      password: {
        required: true,
        minlength: 6
      }
    },
    messages: {
      nickname: {
        required: "Ник не должен быть пустым"
      },
      email: {
        required: "Адрес почты не должен быть пустым",
        email: "Некорректный адрес"
      },
      login: {
        required: "Логин не должен быть пустым"
      },
      password: {
        required: "Пароль не должен быть пустым",
        minlength: jQuery.validator.format("Ваш пароль пароль короче {0} символов")
      }
    }
  });
});
