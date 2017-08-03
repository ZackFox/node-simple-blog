
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
  
    console.log(postText);


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
});
