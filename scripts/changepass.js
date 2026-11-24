(function () {
    'use strict';

    const passwordModal = document.getElementById('passwordModal');
    const openPasswordModalButton = document.getElementById('openModalBtn');
    const closePasswordModalButton = document.getElementById('closeModalBtn');
    const changePasswordForm = document.getElementById('changePasswordForm');

    if (passwordModal && openPasswordModalButton && closePasswordModalButton && changePasswordForm) {
        openPasswordModalButton.addEventListener('click', () => passwordModal.showModal());
        closePasswordModalButton.addEventListener('click', () => passwordModal.close());

        passwordModal.addEventListener('click', (event) => {
            if (event.target === passwordModal) {
                passwordModal.close();
            }
        });

        changePasswordForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (newPassword !== confirmPassword) {
                alert('New Password and Confirm Password do not match!');
                return;
            }

            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'changepassword.php', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

            xhr.onload = function () {
                if (xhr.status === 200) {
                    alert(xhr.responseText);
                    passwordModal.close();
                } else {
                    alert('Something went wrong. Please try again.');
                }
            };

            xhr.onerror = function () {
                alert('Something went wrong. Please try again.');
            };

            const data = `currentPassword=${encodeURIComponent(currentPassword)}&newPassword=${encodeURIComponent(newPassword)}`;
            xhr.send(data);
        });
    }
}());
