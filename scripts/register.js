(function ($) {
    'use strict';

    var calculateAge = function (birthdate) {
        if (!birthdate) {
            return '';
        }

        var parts = birthdate.split('-').map(Number);
        var today = new Date();
        var age = today.getFullYear() - parts[0];
        if (today.getMonth() + 1 < parts[1] ||
            (today.getMonth() + 1 === parts[1] && today.getDate() < parts[2])) {
            age -= 1;
        }
        return age >= 0 ? age : '';
    };

    var showMessage = function (text, kind) {
        var message = document.getElementById('admin-msgs');
        message.replaceChildren();
        message.className = 'account-message account-message--' + kind;
        message.textContent = text;
        message.focus();
    };

    var initialize = function () {
        var form = document.getElementById('frmLogins');
        if (!form) {
            return;
        }

        var birthdate = document.getElementById('bday');
        var age = document.getElementById('age');
        var maxBirthdate = new Date();
        maxBirthdate.setFullYear(maxBirthdate.getFullYear() - 18);
        birthdate.max = [
            maxBirthdate.getFullYear(),
            String(maxBirthdate.getMonth() + 1).padStart(2, '0'),
            String(maxBirthdate.getDate()).padStart(2, '0')
        ].join('-');

        $(birthdate).off('change.registration').on('change.registration', function () {
            age.value = calculateAge(this.value);
        });

        $(form).off('submit.registration').on('submit.registration', function (event) {
            event.preventDefault();
            age.value = calculateAge(birthdate.value);
            if (!form.reportValidity()) {
                return;
            }

            var submitButton = document.getElementById('btnRegister');
            submitButton.disabled = true;
            submitButton.textContent = 'Creating account…';
            form.setAttribute('aria-busy', 'true');
            $.ajax({
                url: 'register.php',
                method: 'POST',
                data: $(form).serialize(),
                dataType: 'json'
            }).done(function (response) {
                if (!response.isSuccess) {
                    showMessage(response.msg || 'The account could not be created.', 'error');
                    return;
                }
                form.reset();
                age.value = '';
                showMessage(response.msg || 'Student account created.', 'success');
            }).fail(function (request) {
                var response = request.responseJSON;
                showMessage(
                    response && response.msg ? response.msg : 'The account could not be created. Check your connection and try again.',
                    'error'
                );
            }).always(function () {
                submitButton.disabled = false;
                submitButton.textContent = 'Create student account';
                form.removeAttribute('aria-busy');
            });
        });
    };

    window.register = {
        init: initialize
    };
}(jQuery));
