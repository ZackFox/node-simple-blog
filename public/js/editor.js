const toolbarOptions = [
  ["bold", "italic", "underline"],
  [{ align: [] }],
  [{ size: ["small", false, "large", "huge"] }],
  [{ color: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["blockquote"],
  [{ header: [1, 2, 3, 4] }],
];

$(document).ready(() => {
  $(".write-post").css("display", "none");

  const quill = new Quill("#editor", {
    modules: { toolbar: toolbarOptions },
    theme: "snow",
  });

  $(".post-submit").click(() => {
    const csrf = $("#csrf").val();
    const author = $("#author").val();
    const title = $("#title").val();

    const editor = document.querySelector('#editor');
    const postText = editor.children[0].innerHTML;

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
    } else {
      
    }
  });
});
