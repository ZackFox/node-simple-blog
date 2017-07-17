$(document).ready(function () {
    // ---- login popup toggle
    $(".login-popup, .modal-close").click(function(e){
        e.preventDefault();
        $(".modal-wrapper").toggleClass("show");
    });
    
    // ----- login request
    $(".loginform").submit(function(e){
        e.preventDefault();
        var login = $("#login").val();
        var password = $("#password").val();
        var csrf = $("#csrf").val();    

        if(login === "" || password === "") $(".message").text("Заполните поля");
        else{
            $.ajax({
                type: "POST",
                url:"/login",
                data: {
                    login:login,
                    password:password,
                    _csrf:csrf
                },
                success: function(res){
                    //Изменить кнопку вход на выход
                    //
                    $(".modal-wrapper").toggleClass("show");   
                },
                error: function(error){ 
                    $(".message").text("Пользователь не найден");
                }
            });
        }        
    });  
}); 