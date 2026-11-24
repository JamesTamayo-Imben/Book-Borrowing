var formatBlock = function() {
    return {
        message: 'TEKA! <img src="" style="display:inline;width:100px;height:100px;" alt="Loading...">',
        css: {
            border: 'none',
            padding: '15px',
            backgroundColor: '#000',
            borderRadius: '10px', 
            opacity: 0.5,
            color: '#fff' 
        }
    };
};

var loadFirst = function() {
    setTimeout(function() {
        $('#loader').addClass('hidden'); 
    }, 400);
};


// var checkSession = function() {
//     $.get('checksession.php', function(data) {
//         var sessiondata = $.parseJSON(data);
//         if(sessiondata.isSuccess) {
//             $(location).attr('href','dashboard.html');
//         } else {
//             loadFirst();
//         }
//     });
// };

// var handleFormEvents = function(){
//     $.validate({
//        form : '#frmLogin',
//        modules: 'security'
//     });
// };

var onLogins = function(){
    $("#frmLogins").submit(function(event) {
        event.preventDefault();
        $('#logins').block(formatBlock());
        var loginObj = $("#frmLogins").serializeArray();

        
        $.post('register.php', loginObj, function(data){
            
            if (data.isSuccess) {
                $("#admin-msgs");
                var msg = data.msg;
                var alert = "<div class='alert alert-success alert-dismissible show' role='alert' id='alert'>" +
               "<strong>Message!<br/>"+ msg +"</strong> "+
               "<button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button>"+
                "</div>";

                $("#admin-msgs").html(alert);
                $('#lname').val(' ');
               $('#fname').val(' ');
console.log("hahaha");
            } else {
                $('#admin-msgs').html(alert);
                 checkSession();
                 console.log("qwert");
            } 

            $('#logins').unblock();
        }, 'json');
   
    });
};


var register = function() {
    "use strict";
    
    return {
        init: function() {
            //  checkSession(),
            // handleFormEvents()
            onLogins()
   
            // btnForgotPass(),
            // cancel(),
            // onForgotPass()
        }
    }
}()
 