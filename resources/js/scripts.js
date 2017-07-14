$(document).ready(function () {
    $(".login-popup, .modal-close").click(function(e){
        e.preventDefault();
        $(".modal-wrapper").toggleClass("show");
    });

    $(".loginform").submit(function(e){
        e.preventDefault();
        var login = $("#login").val();
        var password = $("#password").val();    
        
        if(login === "" || password ==="") $(".message").text("Заполните поля");
        else{
            $.ajax({
                type: "POST",
                url:"/login",
                data: {login: login, password: password},
                success: function(res){
                    console.log(res);
                    $(".modal-wrapper").toggleClass("show");   
                },
                error: function(error){ 
                    $(".message").text("Поля заполнены не верно");
                }
            });
        }        
    });  
});