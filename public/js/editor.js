
$(document).ready(() => {
  $(".write-post").css("display", "none");

  $('#summernote').summernote({
    minHeight: 300,
    toolbar: [
      ['style', ['bold', 'italic', 'underline', 'clear']],
      ['font', ['strikethrough', 'superscript', 'subscript']],
      ['fontsize', ['fontsize']],
      ['color', ['color']],
      ['para', ['ul', 'ol', 'paragraph']],
    ],
  });

  $(".post-submit").click(() => {
    const csrf = $("#csrf").val();
    const author = $("#author").val();
    const title = $("#title").val();
    const postText = $('.note-editable').html();
    const url = "/profile/"+ author +"/post";
  
    if (title !== "" && postText !== "") {
      $.ajax({
        url,
        type: "post",
        data: { _csrf: csrf, author, title, text: postText },
        success: (res) => {
          window.location.replace("/profile/" + author + "/post/" + res.id);
        },
      });
    }
  });

  $(".comment-item").on("click", ".com-edit", function (e) {
    e.preventDefault();
    const commentItem = $(this).closest(".comment-item");
    commentItem.find(".com-delete").css("display", "none");
    commentItem.find(".com-reply").css("display", "none");
    commentItem.find(".com-save").css("display", "block");
    $(this).css("display", "none");
    
    const textarea = commentItem.find(".com-text-container");
    textarea.summernote({ focus: true, toolbar: false });
  });

  //------------save commentary button
  $(".comment-item").on("click", ".com-save", function (e) {
    e.preventDefault();
    const commentItem = $(this).closest(".comment-item");
    commentItem.find(".com-edit").css("display", "block");
    commentItem.find(".com-reply").css("display", "block");
    commentItem.find(".com-delete").css("display", "block");
    $(this).css("display", "none");
    
    const textarea = commentItem.find(".com-text-container");
    textarea.summernote("destroy");

    const _csrf = $(this).data("csrf");
    const url = $(this).data("url");
    const id = $(this).data("reply-id");
    
    if (textarea.html() !== "") {
      $.ajax({  
        url: url + "/reply/" + id,
        type: "put",
        data: { _csrf, text: textarea.html() },
      });
    }
  });


  $(".comment-item").on("click", ".com-delete", function (e) {
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
      success: (res) => {
        commentItem.remove();
      },
    });
  });
});
