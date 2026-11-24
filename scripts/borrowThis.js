

// var formatBlock = function() {
//     return {
//         message: 'Please Wait <img style="display:inline;width:20px;height:20px;" src="public/img/loader.gif"/>',
//         css: {
//             border: 'none',
//             padding: '15px',
//             backgroundColor: '#000',
//             '-webkit-border-radius': '10px',
//             '-moz-border-radius': '10px',
//             opacity: .5,
//             color: '#fff',
//             width: '200px'
//         }
//     };
// }

// var varBorrowThis = function(){
//     $("#form-borrow").submit(function(event) {
//         event.preventDefault();
//         $('#borrow-this').block(formatBlock());
//         var signUpObj = $("#form-borrow").serializeArray();

//         $.post('borrowThis.php', signUpObj, function(data){
            
//            var msg = data.msg;

//             var alert = "<div class='alert alert-success fade in'>" +
//                 "<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>" +
//                 "<strong>Message!</strong>  <br/>" + msg +
//             "</div>";

//             if(data.isSuccess) {

//                 // $(location).attr('href','dashboard.html');
//                 $("#borrow-msg").html(alert);
//                 $('#bookIDD').val('');
//                 $('#borrowedDT').val('');
//                 $('#returnDate').val('');
//                 $('#sid').val('');
//                 $('#adminID').val('');

//                 			/*
// borrowedID
// bookID
// borrowedDate
// returnDate
// studentID
// adminID
// */
     
//             } else {
//                 $("#borrow-msg").html(alert);
//             }

//             $('#borrow-this').unblock();
//         }, 'json');
   
//     });
// }
//             // if(data.isSuccess) {

//             $('#bookIDD').val('');
//             $('#borrowedDT').val('');
//             $('#returnDate').val('');
//             $('#sid').val('');
//             $('#adminID').val('');
     
            
//                   // var alert = "<div class='alert alert-success fade in'>" +
//                   //   "<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>" +
//                   //   "<strong>Message!</strong>  <br/> Your Password was Successfully Change.</div>";
//                   //    $("#signup-msg").html(alert);
                
//             // } 
//     //     }, 'json');
   
//     // });
// // }

// var BorrowThis = function() {
//     "use strict";
    
//     return {
//         init: function() {
//             varBorrowThis()
//                 // onSubmitRegister()
//             // getPersonalInfo(),
//             // getAcademicInfo(),
//             // getScholarType(),
//             // getSchoolYearList(),
//             // //getDutyhoursko(),
//             // onChangeSchoolYearDuty()
//         }
//     }
// }()
// //  



$(document).ready(function () {
    // Attach the form submit event
    $("#form-borrow").submit(function (event) {
        event.preventDefault(); // Prevent the default form submission
        
        // Serialize form data
        var formData = $(this).serialize();

        // Send AJAX POST request to the PHP endpoint
        $.ajax({
            url: "borrowThis.php", // PHP endpoint
            type: "POST",
            data: formData,
            dataType: "json",
            success: function (response) {
                if (response.isSuccess) {
                    // Display success message
                    var successAlert = `
                        <div class='alert alert-success'>
                            <strong>Success!</strong> ${response.msg}
                        </div>`;
                    $("#borrow-msg").html(successAlert);

                    // Clear form inputs
                    $('#bookIDD').val('');
                    $('#borrowedDT').val('');
                    $('#returnDate').val('');
                    $('#sid').val('');
                    $('#adminID').val('');
                } else {
                    // Display error message
                    var errorAlert = `
                        <div class='alert alert-danger'>
                            <strong>Error!</strong> ${response.msg}
                        </div>`;
                    $("#borrow-msg").html(errorAlert);
                }
            },
            error: function (xhr, status, error) {
                // Handle any AJAX errors
                var errorAlert = `
                    <div class='alert alert-danger'>
                        <strong>AJAX Error!</strong> ${error}
                    </div>`;
                $("#borrow-msg").html(errorAlert);
            }
        });
    });
});
