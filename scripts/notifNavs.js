'use strict';

var loadNotificationTab = function(page, initialize) {
    var container = $('#notif-types');
    container
        .attr('aria-busy', 'true')
        .html('<p class="notification-results-state">Loading notifications...</p>');

    $.get(page)
        .done(function(data) {
            container.html(data).attr('aria-busy', 'false');
            $('#viewstitle').empty();

            if (typeof initialize !== 'function') {
                console.error('Notification filter has no initializer:', page);
                container.html(
                    '<p class="notification-results-state notification-results-state--error" role="alert">' +
                    'This notification filter could not be initialized. Refresh and try again.' +
                    '</p>'
                );
                return;
            }

            if (initialize() === false) {
                container.html(
                    '<p class="notification-results-state notification-results-state--error" role="alert">' +
                    'This notification filter could not be initialized. Refresh and try again.' +
                    '</p>'
                );
            }
        })
        .fail(function(xhr, status, error) {
            console.error('Notification filter request failed:', page, error);
            container
                .attr('aria-busy', 'false')
                .html(
                    '<p class="notification-results-state notification-results-state--error" role="alert">' +
                    'This notification filter could not be loaded. Refresh and try again.' +
                    '</p>'
                );
        });
};

var initializeNotificationList = function(name) {
    var list = window[name];
    if (!list || typeof list.init !== 'function') {
        console.error('Notification list component could not be initialized:', name);
        return false;
    }
    list.init();
    return true;
};

$('#notif-all').on('click', function() {
    loadNotificationTab('notif-all.html', function() {
        return initializeNotificationList('notifBoxJs1');
    });
});

$('#notif-warning').on('click', function() {
    loadNotificationTab('notif-warning.html', function() {
        return initializeNotificationList('notifBoxJs2');
    });
});

$('#notif-return').on('click', function() {
    loadNotificationTab('notif-return.html', function() {
        return initializeNotificationList('notifBoxJs3');
    });
});

$('#notif-borrow').on('click', function() {
    loadNotificationTab('notif-borrow.html', function() {
        return initializeNotificationList('notifBoxJs4');
    });
});
