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
                url:"/login",
                type: "POST",
                data: {_csrf:csrf,login:login,password:password},
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
    
    $(".signupform").validate({
        rules:{
            nickname:{
                required:true,
                remote:{ type: "POST", url:"/validate/nickname", dataType: "text",
                    data: {_csrf: $("#csrf").val(), nickname: function(){
                        return $("#nickname").val();}
                    },                
                }                                
            },
            email:{
                required:true,
                email:true,
                remote:{ type: "POST", url:"/validate/email", dataType: "text",
                    data: {_csrf: $("#csrf").val(), email: function(){
                        return $("#email").val();}
                    },                
                }          
            },
            login:{
                required:true
            },
            password:{
                required:true,
                minlength:6      
            }
        },
        messages:{
            nickname:{
                required:"Ник не должен быть пустым"
            },
            email:{
                required:"Адрес почты не должен быть пустым",
                email:"Некорректный адрес"
            },
            login:{
                required:"Логин не должен быть пустым"
            },
            password:{
                required:"Пароль не должен быть пустым",
                minlength: jQuery.validator.format("Ваш пароль пароль короче {0} символов")
            }            
        }
        
        // e.preventDefault();
        // var csrf = $("#csrf").val();
        // var nickname = $("#nickname").val();
        // var email = $("#email").val();    
        
        // var password = $("#password").val();        
        // else{   
        //     $.ajax({
        //         type: "POST",
        //         url:"/login",
        //         data: {
        //             login:login,
        //             password:password,
        //             _csrf:csrf
        //         },
        //         success: function(res){
        //             //Изменить кнопку вход на выход
        //             //
        //             $(".modal-wrapper").toggleClass("show");   
        //         },
        //         error: function(error){ 
        //             $(".message").text("Пользователь не найден");
        //         }
        //     });
        // }        
    });
}); 