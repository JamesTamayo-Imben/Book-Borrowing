// Open and close modal
const modal = document.getElementById('passwordModal');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');

openModalBtn.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    modal.style.display = 'flex'; // Show the modal
});

closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none'; // Hide the modal
});

// Handle form submission in modal
const changePasswordForm = document.getElementById('changePasswordForm');
changePasswordForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent form from reloading the page

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        alert('New Password and Confirm Password do not match!');
        return;
    }

    // AJAX request to change password
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'changepassword.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function () {
        if (xhr.status === 200) {
            alert(xhr.responseText);
            modal.style.display = 'none';
        } else {
            alert('Something went wrong. Please try again.');
        }
    };

    const data = `currentPassword=${encodeURIComponent(currentPassword)}&newPassword=${encodeURIComponent(newPassword)}`;
    xhr.send(data);
});
