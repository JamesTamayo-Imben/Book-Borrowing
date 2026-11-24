(function ($) {
    'use strict';

    var showLoginError = function (message) {
        var target = document.getElementById('admin-msg');
        target.textContent = message;
        target.classList.add('login-message--visible');
        target.focus();
    };

    var redirectForRole = function (role) {
        if (role === 'admin') {
            window.location.assign('dashboard.html');
        } else if (role === 'user') {
            window.location.assign('dashboardUser.html');
        } else {
            showLoginError('This account does not have access to the library.');
        }
    };

    var initialize = function () {
        $.getJSON('checkSession.php')
            .done(function (session) {
                if (session.isSuccess) {
                    redirectForRole(session.role);
                }
            })
            .fail(function (request, status, error) {
                console.error('Unable to check the current sign-in session:', status, error);
            });

        $('#frmLogin').off('submit.login').on('submit.login', function (event) {
            event.preventDefault();
            var form = this;
            if (!form.reportValidity()) {
                return;
            }

            var button = document.getElementById('btnLogin');
            button.disabled = true;
            button.textContent = 'Signing in…';
            form.setAttribute('aria-busy', 'true');
            var target = document.getElementById('admin-msg');
            target.textContent = '';
            target.classList.remove('login-message--visible');

            $.ajax({
                url: 'loginStudent.php',
                method: 'POST',
                data: $(form).serialize(),
                dataType: 'json'
            }).done(function (response) {
                if (!response.isSuccess) {
                    showLoginError(response.msg || 'Sign-in failed. Check your username and password.');
                    return;
                }
                redirectForRole(response.role);
            }).fail(function (request, status, error) {
                console.error('Sign-in request failed:', status, error);
                var response = request.responseJSON;
                showLoginError(
                    response && response.msg
                        ? response.msg
                        : 'Sign-in is unavailable right now. Check your connection and try again.'
                );
            }).always(function () {
                button.disabled = false;
                button.textContent = 'Sign in';
                form.removeAttribute('aria-busy');
            });
        });
    };

    window.Login = {
        init: initialize
    };
}(jQuery));
