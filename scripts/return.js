document.getElementById('frmLogins').addEventListener('submit', function(e) {
    e.preventDefault();

    const studentID = document.getElementById('sid').value.trim();
    const bookID = document.getElementById('bid').value.trim();

    if (studentID === '' || bookID === '') {
        alert('Please fill in both fields.');
        return;
    }

    $.ajax({
        url: 'return.php',
        type: 'POST',
        data: {
            action: 'returnBook',
            studentID: studentID,
            bookID: bookID
        },success: function(response) {
            const res = JSON.parse(response); // Parse the JSON response
            console.log("Server response:", res); // Log server response
    
            if (res.isSuccess) {
              $("#admin-msgs").html(`
              <div class="alert alert-success alert-dismissible show" role="alert">
                  <strong>${res.msg}</strong>
                  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
              `);
              $("#frmLogins")[0].reset();
              userrecords.ajax.reload();
            //   $("#form-borrow-" + bookID)[0].reset(); //<div class="alert alert-success">${res.msg}</div>
            } else {
              $("#admin-msgs").html(`
              <div class="alert alert-danger alert-dismissible show" role="alert">
                  <div>${res.msg}</div>
                  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
              `);
              $("#frmLogins")[0].reset();
            }
          }
        
    });
});
/*

success: function(response) {
        const res = JSON.parse(response); // Parse the JSON response
        console.log("Server response:", res); // Log server response

        if (res.isSuccess) {
          $("#borrow-msg-" + bookID).html(`
          <div class="alert alert-success alert-dismissible show" role="alert">
              <strong>${res.msg}</strong>
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
          `);
          $("#form-borrow-" + bookID)[0].reset(); //<div class="alert alert-success">${res.msg}</div>
        } else {
          $("#borrow-msg-" + bookID).html(`
          <div class="alert alert-danger alert-dismissible show" role="alert">
              <div>${res.msg}</div>
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
          `);
        }
      }




if (res.isSuccess) {
          $("#borrow-msg-" + bookID).html(`
          <div class="alert alert-success alert-dismissible show" role="alert">
              <strong>${res.msg}</strong>
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
          `);
          $("#form-borrow-" + bookID)[0].reset(); //<div class="alert alert-success">${res.msg}</div>
        } else {
          $("#borrow-msg-" + bookID).html(`
          <div class="alert alert-danger alert-dismissible show" role="alert">
              <div>${res.msg}</div>
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
          `);
        }
*/