$(document).ready(() => {
  // ---- login popup toggle
  $(".login-popup, .modal-close").click(e => {
    e.preventDefault();
    $(".modal-wrapper").toggleClass("show");
  });

  // ----- login request
  $(".loginform").submit(e => {
    e.preventDefault();
    const email = $("#email").val();
    const password = $("#password").val();
    const csrf = $("#csrf").val();

    if (email === "" || password === "") {
      $(".login-message").text("Заполните поля");
    } else {
      $.ajax({
        url: "/signin",
        type: "POST",
        data: { _csrf: csrf, email, password },
        success: res => {
          if (res.success) window.location.reload();
          $(".login-message").text(res.message);
        },
      });
    }
  });

  /**
   * like button handler
   */
  $("#btn-like").on("click", function(e) {
    e.preventDefault();
    const $that = $(this);
    const isLiked = $that.data("liked");
    const csrf = $that.data("csrf");

    let url = window.location.pathname;
    let likeCount = $that.find(".likeCount");
    let num = +likeCount.text();
    let method = isLiked ? "DELETE" : "POST";

    $that.data("liked", !isLiked);
    $that
      .find(".fa")
      .toggleClass("fa-heart")
      .toggleClass("fa-heart-o");

    if (isLiked) {
      likeCount.text(num - 1);
    } else {
      likeCount.text(num + 1);
    }

    $.ajax({
      type: method,
      url: url + "/like",
      dataType: "json",
      data: { _csrf: csrf },
      success: res => {
        console.log(res);
      },
    });
  });

  /**
   * subscri button handler
   */
  $("#subscribe").on("click", function(e) {
    e.preventDefault();
    const $that = $(this);
    const csrf = $that.data("csrf");
    const isSubscribe = $that.data("subscribe");

    let url = window.location.pathname;
    let method = isSubscribe ? "DELETE" : "POST";

    if (isSubscribe) {
      $that.text("Подписаться");
    } else {
      $that.text("Отписаться");
    }

    $that.toggleClass("subscribed");
    $that.data("subscribe", !isSubscribe);
    $.ajax({
      type: method,
      url: url + "/subscribe",
      dataType: "json",
      data: { _csrf: csrf },
      success: res => {
        console.log(res);
      },
    });
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
            nickname: () => {
              $("#nickname").val();
            },
          },
        },
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
            email: () => {
              $("#email").val();
            },
          },
        },
      },
      password: {
        required: true,
        minlength: 6,
      },
    },
    messages: {
      nickname: {
        required: "Ник не должен быть пустым",
      },
      email: {
        required: "Адрес почты не должен быть пустым",
        email: "Некорректный адрес",
      },
      login: {
        required: "Логин не должен быть пустым",
      },
      password: {
        required: "Пароль не должен быть пустым",
        minlength: jQuery.validator.format(
          "Ваш пароль пароль короче {0} символов",
        ),
      },
    },
  });

  //------------ button delete post
  $(".post-delete").on("click", function(e) {
    e.preventDefault();
    const _csrf = $(this).data("csrf");
    const url = $(this).data("url");

    $.ajax({
      url: url,
      type: "delete",
      data: { _csrf },
      success: res => {
        document.location.replace("/");
      },
    });
  });

  //------------ button delete reply
  $(".comment-item").on("click", ".com-delete", function(e) {
    e.preventDefault();
    const commentItem = $(this).closest(".comment-item");
    const textarea = commentItem.find(".com-text-container");
    const _csrf = $(this).data("csrf");
    const url = $(this).data("url");
    const id = $(this).data("reply-id");

    $.ajax({
      url: url + "/reply/" + id,
      type: "delete",
      data: { _csrf },
      success: res => {
        commentItem.remove();
      },
    });
  });
});
