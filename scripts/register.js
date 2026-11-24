
var formatBlock = function() {
    return {
        message: '<img src="" style="display:inline;width:100px;height:100px;" alt="Loading...">',
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

var onLogins = function() {
    $("#frmLogins").submit(function(event) {
        event.preventDefault(); // Prevent default form submission
        $('#logins').block(formatBlock()); // Show loading indicator
        
        var loginObj = $("#frmLogins").serialize(); // Serialize form data
        $.post('register.php', loginObj, function(data) {
            $("#admin-msgs").empty(); // Clear existing messages
            var msg = data.msg || "An unexpected error occurred."; // Fallback for undefined message
            var alertType = data.isSuccess ? 'success' : 'danger';
            
            var alert = `
                <div class='alert alert-${alertType} alert-dismissible show' role='alert' id='alert'>
                    <strong>Message! ${msg}</strong>
                    <button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button>
                </div>`;
            
            $("#admin-msgs").html(alert);

            if (data.isSuccess) {
                // Clear form fields
                $('#frmLogins').find('input, select').val('');
                console.log("Success message logged!");
            } else {
                console.log("Error message logged!");
            }
            
            $('#logins').unblock(); // Remove loading indicator
        }, 'json').fail(function() {
            // Handle request errors
            $("#admin-msgs").html(`
                <div class='alert alert-danger alert-dismissible show' role='alert' id='alert'>
                    <strong>Message! Server error occurred. Please try again later.</strong>
                    <button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button>
                </div>`);
            $('#logins').unblock(); // Remove loading indicator
        });
    });
};

var register = function() {
    "use strict";
    return {
        init: function() {
            onLogins();
        }
    };
}();





// var formatBlock = function() {
//     return {
//         message: '<img src="" style="display:inline;width:100px;height:100px;" alt="Loading...">',
//         css: {
//             border: 'none',
//             padding: '15px',
//             backgroundColor: '#000',
//             borderRadius: '10px', 
//             opacity: 0.5,
//             color: '#fff' 
//         }
//     };
// };

// var loadFirst = function() {
//     setTimeout(function() {
//         $('#loader').addClass('hidden'); 
//     }, 400);
// };


// // var checkSession = function() {
// //     $.get('checksession.php', function(data) {
// //         var sessiondata = $.parseJSON(data);
// //         if(sessiondata.isSuccess) {
// //             $(location).attr('href','dashboard.html');
// //         } else {
// //             loadFirst();
// //         }
// //     });
// // };

// // var handleFormEvents = function(){
// //     $.validate({
// //        form : '#frmLogin',
// //        modules: 'security'
// //     });
// // };

// var onLogins = function(){
//     $("#frmLogins").submit(function(event) {
//         event.preventDefault();
//         $('#logins').block(formatBlock());
//         var loginObj = $("#frmLogins").serializeArray();

        
//         $.post('register.php', loginObj, function(data){
            
//             if (data.isSuccess) {
//                 $("#admin-msgs");
//                 var msg = data.msg;
//                 var alert = "<div class='alert alert-success alert-dismissible show' role='alert' id='alert'>" +
//                "<strong>Message! "+ msg +"</strong> "+
//                "<button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button>"+
//                 "</div>";

//                 $("#admin-msgs").html(alert);
//                 $('#username').val(' ');
//                $('#lname').val(' ');
//                $('#mname').val(' ');
//                $('#fname').val(' ');
//                $('#bday').val(' ');
//                $('#age').val(' ');
//                $('#gender').val(' ');
//                $('#connum').val(' ');
//                $('#email').val(' ');
//                $('#insti').val(' ');
//                $('#student').val(' ');
//                $('#province').val(' ');
//                $('#city').val(' ');
//                $('#brgy').val(' ');
//                $('#blk').val(' ');
// console.log("hahaha");
//             } else {
//                 var msg = data.msg;
//                 var alert = "<div class='alert alert-danger alert-dismissible show' role='alert' id='alert'>" +
//                "<strong>Message! "+ msg +"</strong> "+
//                "<button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button>"+
//                 "</div>";

//                 $('#admin-msgs').html(alert);
//                 // checkSession();
//                  console.log("qwert");
                 
//             } 

//             $('#logins').unblock();
//         }, 'json');
   
//     });
// };


// var register = function() {
//     "use strict";
    
//     return {
//         init: function() {
//             //  checkSession(),
//             // handleFormEvents()
//             onLogins()
   
//             // btnForgotPass(),
//             // cancel(),
//             // onForgotPass()
//         }
//     }
// }()
 