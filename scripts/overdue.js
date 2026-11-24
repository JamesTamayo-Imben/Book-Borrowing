document.getElementById('processOverdueBooks').addEventListener('click', function() {
    $.ajax({
        url: 'ovedue.php',
        type: 'POST',
        data: {
            action: 'processOverdue'
        },
        beforeSend: function() {
            $('#message').html('<p style="color:yellow;">Processing overdue books...</p>');
        },
        success: function(response) {
            const data = JSON.parse(response);
            if (data.success) {
                $('#message').html('<p style="color:green;">' + data.message + '</p>');
                // Optionally refresh the table here
                Encounter.init();
            } else {
                $('#message').html('<p style="color:red;">' + data.message + '</p>');
            }
        },
        error: function(xhr, status, error) {
            $('#message').html('<p style="color:red;">Error: ' + error + '</p>');
        }
    });
});
