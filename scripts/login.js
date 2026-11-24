var formatBlock = function() {
    return {
        message: 'Please Wait <img style="display:inline;width:20px;height:20px;" >',
        css: {
            border: 'none',
            padding: '15px',
            backgroundColor: '#000',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            opacity: .5,
            color: '#fff'
        }
    };
}

var loadFirst = function() {
    setTimeout(function() {
        $('#loader').addClass('hidden'); 
    }, 400);
};


// var checkSession = function() {
//     $.get('checkSession.php', function(data) {
//         var sessiondata = $.parseJSON(data);
//         if(sessiondata.isSuccess) {
//             $(location).attr('href','dashboard.html');
//             console.log("ito");
//         } else {
//             loadFirst();
//         }
//     });
// };


var checkSession = function() {
  $.get('checkSession.php', function(data) {
      var sessiondata = $.parseJSON(data);

      if (sessiondata.isSuccess) {
          // if (sessiondata.role === "admin") {
              $(location).attr('href', 'dashboard.html');
          // } else if (sessiondata.role === "user") {
          //     $(location).attr('href', 'dashboardUser.html');
          //     console.log("dito");
          // } else {
          //     console.error("Unknown role: " + sessiondata.role);
          // }
      } else {
          loadFirst(); // Handle inactive session
      }
  });
};



var handleFormEvents = function(){
    $.validate({
       form : '#frmLogin',
       modules: 'security'
    });
};

// var onLogin = function() {
//     $("#frmLogin").submit(function(e) {
//         e.preventDefault();
//         $('#login').block(formatBlock());
//         var loginObj = $("#frmLogin").serializeArray();

//         $.post('loginStudent.php', loginObj, function(data) {
//             if (!data.isSuccess) {
//                 var msg = data.msg;
//                 var alert = "<div class='alert alert-danger fade in'>" +
//                     "<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>" +
//                    msg +
//                     "</div>";
//                 $("#admin-msg").html(alert);
//             } else {
//                 // Redirect based on role
//                 if (data.role === 'admin') {
//                     $(location).attr('href', 'dashboard.html'); 
//                 } else if (data.role === 'user') {
//                     $(location).attr('href', 'try.html');
//                 }
//             }
//             $('#login').unblock();
//         }, 'json');
   
//     });
// };


var onLogin = function () {
    $("#frmLogin").submit(function (e) {
      e.preventDefault();
  
      // Safely call blockUI
      if ($.blockUI) {
        $('#login').block(formatBlock());
      } else {
        console.error("BlockUI plugin is not loaded.");
      }
  
      var loginObj = $("#frmLogin").serializeArray();
  
      $.post('loginStudent.php', loginObj, function (data) {
        console.log(data); // Debug response structure
        if (!data.isSuccess) {
          var msg = data.msg || "Login failed.";
          var alert =
            "<div class='alert alert-danger fade in'>" +
            "<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>" +
            msg +
            "</div>";
          $("#admin-msg").html(alert);
        } else {
          // Redirect based on role
          if (data.role === 'admin') {
            $(location).attr('href', 'dashboard.html');
          } else if (data.role === 'user') {
            $(location).attr('href', 'dashboardUser.html');
          }
        }
        if ($.unblockUI) {
          $('#login').unblock();
        }
      }, 'json').fail(function (jqXHR, textStatus, errorThrown) {
        console.error("AJAX error:", textStatus, errorThrown);
        if ($.unblockUI) {
          $('#login').unblock();
        }
      });
    });
  };
  

var Login = function() {
    "use strict";
    
    return {
        init: function() {
             checkSession(),
            handleFormEvents()
            onLogin()
   
            // btnForgotPass(),
            // cancel(),
            // onForgotPass()
        }
    }
}()
