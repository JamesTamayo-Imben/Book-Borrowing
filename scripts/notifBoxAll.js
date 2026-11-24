

var notifBoxJs1 = function() {
    "use strict";
  
    var createNotifBox = function(notif) {
        return `
        <div class="notif-box pad-ko mt-3 row" style="border: 1px solid ${notif.notificationColor}">
            <div class="col-11">
                <div class="notif-title h5 d-flex justify-content-between">
                    ${notif.notificationType}!
                    <span class="notif-date ml-auto" style="color: #6b6b6b;">
                    ${notif.notificationDate}
                    </span>
                </div>
                <hr>
                <div class="notif-message p">
                ${notif.notificationMessage}
                </div>
            </div>
            <div class="col-1 d-flex justify-content-center align-items-center">
                <div class="notif-remove" style="cursor: pointer" data-id="${notif.notificationID}">
                    <i class="bi bi-trash3"></i>
                </div>
            </div>
        </div>
        `;
    };

    var loadNotifAll = function() {
        $.ajax({
            url: "notifBoxAll.php",
            method: "GET",
            dataType: "json",
            success: function(response) {
                var notifs = response.value; 
                var container = $('#notif-box-all');
                container.empty(); 
  
                if (notifs && notifs.length > 0) {
                    notifs.forEach(function(notif) {
                        container.append(createNotifBox(notif));
                    });
                } else {
                    container.html(`<p class="mt-4 text-center">No Notification available.</p>`);
                }

                // Add delete button event listener
                $('.notif-remove').on('click', function() {
                    var notificationID = $(this).data('id');
                    deleteNotification(notificationID);
                });
            },
            error: function() {
                alert("Failed to load notif.");
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
        <div class="notif-box pad-ko mt-3 row" style="border: 1px solid ${notif.notificationColor}">
            <div class="col-11">
                <div class="notif-title h5 d-flex justify-content-between">
                    ${notif.notificationType}!
                    <span class="notif-date ml-auto" style="color: #6b6b6b;">
                    ${notif.notificationDate}
                    </span>
                </div>
                <hr>
                <div class="notif-message p">
                ${notif.notificationMessage}
               </div>
            </div>
            <div class="col-1 d-flex justify-content-center align-items-center">
                <div class="notif-remove" style="cursor: pointer" data-id="${notif.notificationID}">
                    <i class="bi bi-trash3"></i>
                </div>
            </div>
         </div>
        `;
    };
// notificationType, notificationMessage, notificationDate

    var loadNotifWarning = function() {
        $.ajax({
            url: "notifBoxWarning.php",
            method: "GET",
            dataType: "json",
            success: function(response) {
                var notifs = response.value; 
                var container = $('#notif-box-warning');
                container.empty(); 
  
                if (notifs && notifs.length > 0) {
                    notifs.forEach(function(notif) {
                        container.append(createNotifBox(notif));
                    });
                } else {
                    container.html(`<p class="mt-4 text-center">No Notification available.</p>`);
                }

                // Add delete button event listener
                $('.notif-remove').on('click', function() {
                    var notificationID = $(this).data('id');
                    deleteNotification(notificationID);
                });
  
            },
            error: function() {
                alert("Failed to load notif.");
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
        <div class="notif-box pad-ko mt-3 row" style="border: 1px solid ${notif.notificationColor}">
            <div class="col-11">
                <div class="notif-title h5 d-flex justify-content-between">
                    ${notif.notificationType}!
                    <span class="notif-date ml-auto" style="color: #6b6b6b;">
                    ${notif.notificationDate}
                    </span>
                </div>
                <hr>
                <div class="notif-message p">
                ${notif.notificationMessage}
               </div>
            </div>
            <div class="col-1 d-flex justify-content-center align-items-center">
                <div class="notif-remove" style="cursor: pointer" data-id="${notif.notificationID}">
                    <i class="bi bi-trash3"></i>
                </div>
            </div>
         </div>
        `;
    };
// notificationType, notificationMessage, notificationDate

    var loadNotifReturn = function() {
        $.ajax({
            url: "notifBoxReturn.php",
            method: "GET",
            dataType: "json",
            success: function(response) {
                var notifs = response.value; 
                var container = $('#notif-box-return');
                container.empty(); 
  
                if (notifs && notifs.length > 0) {
                    notifs.forEach(function(notif) {
                        container.append(createNotifBox(notif));
                    });
                } else {
                    container.html(`<p class="mt-4 text-center">No Notification available.</p>`);
                }
    // Add delete button event listener
    $('.notif-remove').on('click', function() {
        var notificationID = $(this).data('id');
        deleteNotification(notificationID);
    });

    },
    error: function() {
    alert("Failed to load notif.");
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
        <div class="notif-box pad-ko mt-3 row" style="border: 1px solid ${notif.notificationColor}">
            <div class="col-11">
                <div class="notif-title h5 d-flex justify-content-between">
                    ${notif.notificationType}!
                    <span class="notif-date ml-auto" style="color: #6b6b6b;">
                    ${notif.notificationDate}
                    </span>
                </div>
                <hr>
                <div class="notif-message p">
                ${notif.notificationMessage}
               </div>
            </div>
            <div class="col-1 d-flex justify-content-center align-items-center">
                <div class="notif-remove" style="cursor: pointer" data-id="${notif.notificationID}">
                    <i class="bi bi-trash3"></i>
                </div>
            </div>
         </div>
        `;
    };
// notificationType, notificationMessage, notificationDate

    var loadNotifBorrow = function() {
        $.ajax({
            url: "notifBoxBorrow.php",
            method: "GET",
            dataType: "json",
            success: function(response) {
                var notifs = response.value; 
                var container = $('#notif-box-borrow');
                container.empty(); 
  
                if (notifs && notifs.length > 0) {
                    notifs.forEach(function(notif) {
                        container.append(createNotifBox(notif));
                        console.log("dito");
                    });
                    
                } else {
                    container.html(`<p class="mt-4 text-center">No Notification available.</p>`);
                }
  
         // Add delete button event listener
    $('.notif-remove').on('click', function() {
        var notificationID = $(this).data('id');
        deleteNotification(notificationID);
    });

    },
    error: function() {
    alert("Failed to load notif.");
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