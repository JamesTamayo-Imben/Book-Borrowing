function updateUI(selector, content) {
    $(selector).html(content);
}

function handleAjaxError(xhr, status, error, selector) {
    console.error(`Error occurred: ${status} - ${error}`); // Log detailed error for debugging
    updateUI(selector, 'An error occurred. Please try again.');
}

// Fetch borrowed and overdue counts
$.ajax({
    url: 'AllBookBorrow.php',
    type: 'GET',
    dataType: 'json',
    success: function(response) {
        if (response.success) {
            updateUI('#AllBorrow', `${response.totalBorrow} books.`);
        } else {
            const errorMessage = `Error: ${response.message}`;
            updateUI('#AllBorrow', errorMessage);
        }
    },
    error: function(xhr, status, error) {
        handleAjaxError(xhr, status, error, '#AllBorrow');
    }
});



