function updateUI(selector, content) {
    $(selector).html(content);
}

function handleAjaxError(xhr, status, error, selector) {
    console.error(`Error occurred: ${status} - ${error}`); // Log detailed error for debugging
    updateUI(selector, 'An error occurred. Please try again.');
}

// Fetch borrowed and overdue counts
$.ajax({
    url: 'numBorrow.php',
    type: 'GET',
    dataType: 'json',
    success: function(response) {
        if (response.success) {
            updateUI('#numBorrow', `${response.borrowedCount} books.`);
            updateUI('#numOver', `${response.overdueCount}  books.`);
        } else {
            const errorMessage = `Error: ${response.message}`;
            updateUI('#numBorrow', errorMessage);
            updateUI('#numOver', errorMessage);
        }
    },
    error: function(xhr, status, error) {
        handleAjaxError(xhr, status, error, '#numBorrow');
        handleAjaxError(xhr, status, error, '#numOver');
    }
});

// Fetch warning count
// Function to update the warning count UI
function updateWarningCount(warningCount) {
    const warningElement = document.querySelector('.warningCount');

    if (warningCount === 2) {
        warningElement.style.border = '2px solid yellow';
    } else if (warningCount >= 3) {
        warningElement.style.border = '2px solid red';
    } else {
        warningElement.style.border = '1px solid #70ee9c'; // Default green color
    }

    document.getElementById('count').textContent = warningCount;
}

// Fetch warning count
$.ajax({
    url: 'numBorrow.php',
    type: 'GET',
    dataType: 'json',
    success: function(response) {
        if (response.success) {
            const warningCount = response.warningCount;
            updateWarningCount(warningCount);
        } else {
            document.getElementById('count').textContent = `Error: ${response.message}`;
        }
    },
    error: function(xhr, status, error) {
        console.error(`Error fetching warning count: ${status} - ${error}`);
        document.getElementById('count').textContent = 'Error fetching warning count.';
    }
});

