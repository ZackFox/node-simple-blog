$(document).ready(function () {
    // ---- login popup toggle
    $(".login-popup, .modal-close").click(function(e){
        e.preventDefault();
        $(".modal-wrapper").toggleClass("show");
    });
    
    // ----- login request
    $(".loginform").submit(function(e){
        e.preventDefault();
        var nickname = $("#nickname").val();
        var password = $("#password").val();
        var csrf = $("#csrf").val();    

        if(nickname === "" || password === "") 
            $(".message").text("Заполните поля");
        else{
            $.ajax({
                url:"/signin",
                type: "POST",
                data: {_csrf:csrf, nickname:nickname,password:password},
                success: function(res){
                    if(res.success) window.location.reload();                
                    $(".message").text(res.message);      
                } 
            });
        }        
    });
    

///-----------------------------------
    $(".signupform").validate({
        rules:{
            nickname:{
                required:true,
                remote:{ type: "POST", url:"/validate", dataType: "text",
                    data: {_csrf: $("#csrf").val(), valid:"nickname",
                            nickname: function(){ return $("#nickname").val();}
                    }               
                }                                
            },
            email:{
                required:true,
                email:true,
                remote:{ type: "POST", url:"/validate", dataType: "text",
                    data: {_csrf: $("#csrf").val(), valid:"email",
                            email: function(){ return $("#email").val();}
                    }                
                }          
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
        
    });
});     