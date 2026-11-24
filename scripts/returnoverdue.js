document.getElementById('RfrmLogins').addEventListener('submit', function(e) {
    e.preventDefault();

    const studentID = document.getElementById('Rsid').value.trim();
    const bookID = document.getElementById('Rbid').value.trim();

    if (studentID === '' || bookID === '') {
        alert('Please fill in both fields.');
        return;
    }

    $.ajax({
        url: 'returnoverdue.php',
        type: 'POST',
        data: {
            action: 'returnBook',
            studentID: studentID,
            bookID: bookID
        },success: function(response) {
            const res = JSON.parse(response); // Parse the JSON response
            console.log("Server response:", res); // Log server response
    
            if (res.isSuccess) {
              $("#Radmin-msgs").html(`
              <div class="alert alert-success alert-dismissible show" role="alert">
                  <strong>${res.msg}</strong>
                  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
              `);
              $("#RfrmLogins")[0].reset();
              userrecords.ajax.reload();
            //   $("#form-borrow-" + bookID)[0].reset(); //<div class="alert alert-success">${res.msg}</div>
            } else {
              $("#Radmin-msgs").html(`
              <div class="alert alert-danger alert-dismissible show" role="alert">
                  <div>${res.msg}</div>
                  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
              `);
              $("#RfrmLogins")[0].reset();
            }
          }
        
    });
});



// document.getElementById('frmLogins').addEventListener('submit', function(e) {
//     e.preventDefault();

//     const studentID = document.getElementById('sid').value.trim();
//     const bookID = document.getElementById('bid').value.trim();

//     if (studentID === '' || bookID === '') {
//         alert('Please fill in both fields.');
//         return;
//     }

//     $.ajax({
//         url: 'returnoverdue.php',
//         type: 'POST',
//         data: {
//             action: 'returnBook',
//             studentID: studentID,
//             bookID: bookID
//         },
//         beforeSend: function() {
//             $('#admin-msgs').html(formatBlock().message);
//         },
//         success: function(response) {
//             $('#admin-msgs').html(response);
//         },
//         error: function(xhr, status, error) {
//             $('#admin-msgs').html('<p style="color:red;">Error: ' + error + '</p>');
//         }
//     });
// });
