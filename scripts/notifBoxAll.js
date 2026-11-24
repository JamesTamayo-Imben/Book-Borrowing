var failNotificationList = function(containerSelector, error) {
    console.error('Notification request failed:', error);
    $(containerSelector)
        .attr('aria-busy', 'false')
        .html(
            '<p class="notification-results-state notification-results-state--error" role="alert">' +
            'Notifications could not be loaded. Refresh and try again.' +
            '</p>'
        );
};

var showNotificationLoading = function(containerSelector) {
    $(containerSelector)
        .attr('aria-busy', 'true')
        .html('<p class="notification-results-state">Loading notifications...</p>');
};

var notifBoxJs1 = function() {
    "use strict";
  
    var createNotifBox = function(notif) {
        return `
        <article class="notification-card">
            <div class="notification-card-content">
                <div class="notification-card-heading">
                    <h2 class="notification-title">${notif.notificationType}</h2>
                    <time class="notification-date">${notif.notificationDate}</time>
                </div>
                <p class="notification-message">${notif.notificationMessage}</p>
            </div>
            <button class="notif-remove notification-delete" type="button" data-id="${notif.notificationID}" aria-label="Delete notification">
                <i class="bi bi-trash3" aria-hidden="true"></i>
            </button>
        </article>
        `;
    };

    var loadNotifAll = function() {
        showNotificationLoading('#notif-box-all');
        $.ajax({
            url: "notifBoxAll.php",
            method: "GET",
            dataType: "json",
            success: function(response) {
                var notifs = response.value; 
                var container = $('#notif-box-all');
                container.attr('aria-busy', 'false').empty();
  
                if (notifs && notifs.length > 0) {
                    notifs.forEach(function(notif) {
                        container.append(createNotifBox(notif));
                    });
                } else {
                    container.html('<p class="notification-results-state">No notifications in this filter.</p>');
                }

                // Add delete button event listener
                $('.notif-remove').on('click', function() {
                    var notificationID = $(this).data('id');
                    deleteNotification(notificationID);
                });
            },
            error: function(xhr, status, error) {
                failNotificationList('#notif-box-all', error);
            }
        });
    };

    var deleteNotification = function(notificationID) {
        $.ajax({
            url: "notifDelete.php",
            method: "POST",
            data: { id: notificationID },
            success: function(response) {
                if (response.success) {
                    window.dispatchEvent(new CustomEvent('notifications:changed'));
                   // alert("Notification deleted successfully.");
                    loadNotifAll(); // Reload notifications
                } else {
                    alert("Failed to delete notification.");
                }
            },
            error: function() {
                alert("Error while deleting notification.");
            }
        });
    };

    return {
        init: function() {
            loadNotifAll(); 
        }
    };
}();



  var notifBoxJs2 = function() {
    "use strict";
  
  
    var createNotifBox = function(notif) {

        return `
  <!-- Notification-->
        <article class="notification-card">
            <div class="notification-card-content">
                <div class="notification-card-heading">
                    <h2 class="notification-title">${notif.notificationType}</h2>
                    <time class="notification-date">${notif.notificationDate}</time>
                </div>
                <p class="notification-message">${notif.notificationMessage}</p>
            </div>
            <button class="notif-remove notification-delete" type="button" data-id="${notif.notificationID}" aria-label="Delete notification">
                <i class="bi bi-trash3" aria-hidden="true"></i>
            </button>
        </article>
        `;
    };
// notificationType, notificationMessage, notificationDate

    var loadNotifWarning = function() {
        showNotificationLoading('#notif-box-warning');
        $.ajax({
            url: "notifBoxWarning.php",
            method: "GET",
            dataType: "json",
            success: function(response) {
                var notifs = response.value; 
                var container = $('#notif-box-warning');
                container.attr('aria-busy', 'false').empty();
  
                if (notifs && notifs.length > 0) {
                    notifs.forEach(function(notif) {
                        container.append(createNotifBox(notif));
                    });
                } else {
                    container.html('<p class="notification-results-state">No notifications in this filter.</p>');
                }

                // Add delete button event listener
                $('.notif-remove').on('click', function() {
                    var notificationID = $(this).data('id');
                    deleteNotification(notificationID);
                });
  
            },
            error: function(xhr, status, error) {
                failNotificationList('#notif-box-warning', error);
            }
        });
    };


    var deleteNotification = function(notificationID) {
        $.ajax({
            url: "notifDelete.php",
            method: "POST",
            data: { id: notificationID },
            success: function(response) {
                if (response.success) {
                   window.dispatchEvent(new CustomEvent('notifications:changed'));
                   // alert("Notification deleted successfully.");
                   loadNotifWarning(); // Reload notifications
                } else {
                    alert("Failed to delete notification.");
                }
            },
            error: function() {
                alert("Error while deleting notification.");
            }
        });
    };
  
    return {
        init: function() {
            loadNotifWarning(); 
        }
    };
  }();



  var notifBoxJs3 = function() {
    "use strict";
  
  
    var createNotifBox = function(notif) {

        return `
  <!-- Notification-->
        <article class="notification-card">
            <div class="notification-card-content">
                <div class="notification-card-heading">
                    <h2 class="notification-title">${notif.notificationType}</h2>
                    <time class="notification-date">${notif.notificationDate}</time>
                </div>
                <p class="notification-message">${notif.notificationMessage}</p>
            </div>
            <button class="notif-remove notification-delete" type="button" data-id="${notif.notificationID}" aria-label="Delete notification">
                <i class="bi bi-trash3" aria-hidden="true"></i>
            </button>
        </article>
        `;
    };
// notificationType, notificationMessage, notificationDate

    var loadNotifReturn = function() {
        showNotificationLoading('#notif-box-return');
        $.ajax({
            url: "notifBoxReturn.php",
            method: "GET",
            dataType: "json",
            success: function(response) {
                var notifs = response.value; 
                var container = $('#notif-box-return');
                container.attr('aria-busy', 'false').empty();
  
                if (notifs && notifs.length > 0) {
                    notifs.forEach(function(notif) {
                        container.append(createNotifBox(notif));
                    });
                } else {
                    container.html('<p class="notification-results-state">No notifications in this filter.</p>');
                }
    // Add delete button event listener
    $('.notif-remove').on('click', function() {
        var notificationID = $(this).data('id');
        deleteNotification(notificationID);
    });

    },
    error: function(xhr, status, error) {
    failNotificationList('#notif-box-return', error);
    }
    });
    };


    var deleteNotification = function(notificationID) {
    $.ajax({
    url: "notifDelete.php",
    method: "POST",
    data: { id: notificationID },
    success: function(response) {
    if (response.success) {
    window.dispatchEvent(new CustomEvent('notifications:changed'));
    // alert("Notification deleted successfully.");
    loadNotifReturn(); // Reload notifications
    } else {
        alert("Failed to delete notification.");
    }
    },
    error: function() {
    alert("Error while deleting notification.");
    }
    });
    };
    return {
        init: function() {
            loadNotifReturn(); 
        }
    };
  }();




  var notifBoxJs4 = function() {
    "use strict";
  
  
    var createNotifBox = function(notif) {

        return `
  <!-- Notification-->
        <article class="notification-card">
            <div class="notification-card-content">
                <div class="notification-card-heading">
                    <h2 class="notification-title">${notif.notificationType}</h2>
                    <time class="notification-date">${notif.notificationDate}</time>
                </div>
                <p class="notification-message">${notif.notificationMessage}</p>
            </div>
            <button class="notif-remove notification-delete" type="button" data-id="${notif.notificationID}" aria-label="Delete notification">
                <i class="bi bi-trash3" aria-hidden="true"></i>
            </button>
        </article>
        `;
    };
// notificationType, notificationMessage, notificationDate

    var loadNotifBorrow = function() {
        showNotificationLoading('#notif-box-borrow');
        $.ajax({
            url: "notifBoxBorrow.php",
            method: "GET",
            dataType: "json",
            success: function(response) {
                var notifs = response.value; 
                var container = $('#notif-box-borrow');
                container.attr('aria-busy', 'false').empty();
  
                if (notifs && notifs.length > 0) {
                    notifs.forEach(function(notif) {
                        container.append(createNotifBox(notif));
                        console.log("dito");
                    });
                    
                } else {
                    container.html('<p class="notification-results-state">No notifications in this filter.</p>');
                }
  
         // Add delete button event listener
    $('.notif-remove').on('click', function() {
        var notificationID = $(this).data('id');
        deleteNotification(notificationID);
    });

    },
    error: function(xhr, status, error) {
    failNotificationList('#notif-box-borrow', error);
    }
    });
    };


    var deleteNotification = function(notificationID) {
    $.ajax({
    url: "notifDelete.php",
    method: "POST",
    data: { id: notificationID },
    success: function(response) {
    if (response.success) {
    window.dispatchEvent(new CustomEvent('notifications:changed'));
    // alert("Notification deleted successfully.");
    loadNotifBorrow(); // Reload notifications
    } else {
        alert("Failed to delete notification.");
    }
    },
    error: function() {
    alert("Error while deleting notification.");
    }
    });
    };
  
    return {
        init: function() {
            loadNotifBorrow(); 
        }
    };
  }();