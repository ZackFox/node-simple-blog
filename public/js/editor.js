
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
  
  //------------ button submit new article 
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
  
  //--------------enable editor for new reply
  $(".empty-reply").summernote({ toolbar: false });
  
  //--------------- new reply send button
  $(".comment-item").on("click", ".reply-send", function (e) {
    e.preventDefault();
    const commentItem = $(this).closest(".comment-item");
    const _csrf = $(this).data("csrf");
    const url = $(this).data("url");
    const author = $(this).data("author");
    const textarea = commentItem.find(".note-editable");
    const text = textarea.html();

    $.ajax({
      url: url + "/reply/",
      type: "post",
      data: { _csrf, author, text },
      success: (res) => {
        // textarea.html("<p><br></p>");
        document.location.reload();
        
      }
    });
  });

  //--------------- button edit reply
  $(".comment-item").on("click", ".com-edit", function (e) {
    e.preventDefault();
    const commentItem = $(this).closest(".comment-item");
    $(this).toggleClass("hidden");
    commentItem.find(".com-delete").toggleClass("hidden");
    commentItem.find(".com-reply").toggleClass("hidden");
    commentItem.find(".com-save").toggleClass("show");
    commentItem.find(".com-cancel").toggleClass("show");

    const textarea = commentItem.find(".com-text-container");
    textarea.summernote({ focus: true, toolbar: false });
  });

  //------------ button save editable reply 
  $(".comment-item").on("click", ".com-save", function (e) {
    e.preventDefault();
    const commentItem = $(this).closest(".comment-item");
    $(this).toggleClass("show");
    commentItem.find(".com-delete").toggleClass("hidden");
    commentItem.find(".com-reply").toggleClass("hidden");
    commentItem.find(".com-edit").toggleClass("hidden");
    commentItem.find(".com-cancel").toggleClass("show");

    const textarea = commentItem.find(".com-text-container");
    textarea.summernote("destroy");

    const _csrf = $(this).data("csrf");
    const url = $(this).data("url");
    const id = $(this).data("reply-id");
    const text = textarea.html();

    if (textarea.html() !== "") {
      $.ajax({
        url: url + "/reply/" + id,
        type: "put",
        data: { _csrf, text },
      });
    }
  });

  $(".comment-item").on("click", ".com-cancel", function (e){
    e.preventDefault();
    const commentItem = $(this).closest(".comment-item");
    const textarea = commentItem.find(".com-text-container");
    commentItem.find(".com-delete").toggleClass("hidden");
    commentItem.find(".com-reply").toggleClass("hidden");
    commentItem.find(".com-edit").toggleClass("hidden");
    commentItem.find(".com-save").toggleClass("show");
    $(this).toggleClass("show");
    textarea.summernote("destroy");
  });

  //------------ button delete reply 
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
