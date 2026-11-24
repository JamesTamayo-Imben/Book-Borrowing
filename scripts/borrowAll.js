var showBorrowLoading = function(containerSelector, message) {
    $(containerSelector)
        .attr('aria-busy', 'true')
        .attr('aria-live', 'polite')
        .html('<p class="borrow-results-state">' + message + '</p>');
};

var renderBorrowResults = function(containerSelector, updates, createCard, emptyMessage) {
    var container = $(containerSelector);
    container.attr('aria-busy', 'false').attr('aria-live', 'polite').empty();

    if (!Array.isArray(updates)) {
        container.html(
            '<p class="borrow-results-state borrow-results-state--error" role="alert">' +
            'Borrowing records could not be loaded. Refresh and try again.' +
            '</p>'
        );
        console.error('Borrowed books response did not contain a result list.');
        return;
    }

    if (updates.length === 0) {
        container.html('<p class="borrow-results-state">' + emptyMessage + '</p>');
        return;
    }

    container.append(
        '<p class="borrow-results-summary">' + updates.length +
        (updates.length === 1 ? ' book in this list' : ' books in this list') + '</p>'
    );
    updates.forEach(function(update) {
        container.append(createCard(update));
    });
};

var failBorrowResults = function(containerSelector, error) {
    console.error('Error loading borrowed books:', error);
    $(containerSelector)
        .attr('aria-busy', 'false')
        .attr('aria-live', 'polite')
        .html(
            '<p class="borrow-results-state borrow-results-state--error" role="alert">' +
            'Borrowing records could not be loaded. Refresh and try again.' +
            '</p>'
        );
};

var returnUpdate1 = function () {
    "use strict";

    // Create the HTML structure for a borrowed book
    var createUpdateBox = function (update) {
        return `
        <div class="borrow-record-item">
            <div class="borrow-box-holder">
                <div class="borrow-box pad-ko mt-3 row">
                    <div class="book-img col-lg-4">
                        <button class="book-cover-button borrowed-book-cover" type="button" aria-label="View book cover"><img src="${update.image}" alt=""></button>
                    </div>
                    <div class="book-info col-lg-8 pb-3">
                        <h3 class="mb-3 h-light">${update.title}</h3>
                        <p class="mb-1 for-text">Author: <strong>${update.author}</strong></p>
                        <p class="mb-1 for-text">ID: <span style="color: #8b8c8f;font-weight: 600">${update.bookID}</span></p>
                        <p class="mb-1 for-text">Borrowed: <i style="color: #8b8c8f;font-weight: 500">${update.borrowedDate}</i></p>
                        <p class="mb-3 for-text">Due date: <i class="h-light">${update.returnDate}</i></p>
                        <button type="button" class="btn btn-success px-4" data-bs-toggle="modal" data-bs-target="#exampleModal-${update.bookID}">Extend</button>

                        <!-- Modal -->
                        <div class="modal" id="exampleModal-${update.bookID}" tabindex="-1" aria-labelledby="exampleModalLabel-${update.bookID}" aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h1 class="modal-title fs-5 text-secondary" id="exampleModalLabel-${update.bookID}">Extend Return Date</h1>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <form id="extendForm-${update.bookID}">
                                            <div class="mb-3">
                                                <input type="hidden" name="${update.bookID}" id="${update.bookID}" value="${update.bookID}">
                                                <label for="extendReturn-${update.bookID}" class="col-form-label">Return Date:</label>
                                                <input type="date" class="form-control" id="extendReturn-${update.bookID}" required  min="${getCurrentDate()}" max="${getAdd30daysDate()}">
                                            </div>
                                        </form>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="button" class="btn btn-primary confirm-update" data-id="${update.bookID}" data-bs-dismiss="modal">Confirm</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    };

    // Load all borrowed books
    var loadreturnUpdate1 = function () {
        showBorrowLoading('#borrow-box-all', 'Loading your borrowed books...');
        $.ajax({
            url: "borrowAll.php",
            method: "GET",
            dataType: "json",
            success: function (response) {
                renderBorrowResults(
                    '#borrow-box-all',
                    response.value,
                    createUpdateBox,
                    'You have no borrowed books right now.'
                );
            },
            error: function (xhr, status, error) {
                failBorrowResults('#borrow-box-all', error);
            }
        });
    };

    // Update return date
    var updateReturnDate = function (updateBookID) {
        var newDate = $(`#extendReturn-${updateBookID}`).val();
        if (!newDate) {
            alert("Please select a return date.");
            return;
        }

        $.ajax({
            url: "borrowReturnUpdate.php",
            method: "POST",
            data: { id: updateBookID, returnDate: newDate },
            success: function (response) {
                console.log("Server Response:", response);
                if (response.success) {
                   // alert("Return date updated successfully!");
                    let modalElement = document.getElementById(`exampleModal-${updateBookID}`);
                    let modalInstance = bootstrap.Modal.getInstance(modalElement);
                    if (modalInstance) {
                        modalInstance.hide(); // Properly hide the modal
                    }
                    loadreturnUpdate1(); // Refresh the data
                } else {
                    alert(response.error || "Failed to update return date.");
                }
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
                alert("Error while updating return date.");
            }
        });
    };

    return {
        init: function () {
            loadreturnUpdate1();

            // Event delegation for dynamically added elements
            $('#borrow-box-all').on('click', '.confirm-update', function () {
                var updateBookID = $(this).data('id');
                updateReturnDate(updateBookID);
            });
        }
    };
}();

var returnUpdate1B = function() {
    "use strict";

    // Create the HTML structure for a borrowed book
    var createUpdateBox = function(update) {
        return `
         <div class="borrow-record-item">
            <div class="borrow-box-holder">
                <div class="borrow-box pad-ko mt-3 row">
                    <div class="book-img col-lg-4">
                        <button class="book-cover-button borrowed-book-cover" type="button" aria-label="View book cover"><img src="${update.image}" alt=""></button>
                    </div>
                    <div class="book-info-due  col-lg-8 pb-3">
                        <h3 class="mb-3" style="color: #ee2f25">${update.title}</h3>
                        <p class="mb-1 for-text">Author: <strong>${update.author}</strong></p>
                        <p class="mb-1 for-text">ID: <span style="color: #8b8c8f;font-weight: 600">${update.bookID}</span></p>
                        <p class="mb-1 for-text">Borrowed: <i style="color: #8b8c8f;font-weight: 500">${update.borrowedDate}</i></p> <!-- Display borrowed date -->
                        <p class="mb-3 for-text">Due date: <i style="color: #ee2f25">${update.returnDate}</i></p>
                        <button type="button" class="btn btn-success px-4" data-bs-toggle="modal" data-bs-target="#exampleModal-${update.bookID}">Extend</button>

                        <!-- Modal -->
                        <div class="modal" id="exampleModal-${update.bookID}" tabindex="-1" aria-labelledby="exampleModalLabel-${update.bookID}" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h1 class="modal-title fs-5 text-secondary" id="exampleModalLabel-${update.bookID}">Extend Return Date</h1>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <form id="extendForm-${update.bookID}">
                                            <div class="mb-3">
                                                <input type="hidden" name="${update.bookID}" id="${update.bookID}" value="${update.bookID}">
                                                <label for="extendReturn-${update.bookID}" class="col-form-label">Return Date:</label>
                                                <input type="date" class="form-control" id="extendReturn-${update.bookID}" required min="${getCurrentDate()}" max="${getAdd30daysDate()}">
                                            </div>
                                        </form>
                                    </div>
                                    <div class="modal-footer due-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="button" class="btn btn-primary confirm-update" data-id="${update.bookID}" data-bs-dismiss="modal">Confirm</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    };

    // Load all borrowed books
    var loadreturnUpdate1B = function() {
        showBorrowLoading('#borrow-box-all-over', 'Checking for overdue books...');
        $.ajax({
            url: "borrowOver.php",
            method: "GET",
            dataType: "json",
            success: function(response) {
                renderBorrowResults(
                    '#borrow-box-all-over',
                    response.value,
                    createUpdateBox,
                    'No overdue books. You are up to date.'
                );
            },
            error: function(xhr, status, error) {
                failBorrowResults('#borrow-box-all-over', error);
            }
        });
    };

    // Update return date
    var updateReturnDate = function(updateBookID) {
        var newDate = $(`#extendReturn-${updateBookID}`).val();
        if (!newDate) {
            alert("Please select a return date.");
            return;
        }

        $.ajax({
            url: "borrowOverReturn.php",
            method: "POST",
            data: { id: updateBookID, returnDate: newDate },
            success: function(response) {
                console.log("Server Response:", response);

                if (response.success) {
                    alert("Return date updated successfully!");
                    let modalElement = document.getElementById(`exampleModal-${updateBookID}`);
                    let modalInstance = bootstrap.Modal.getInstance(modalElement);
                    if (modalInstance) {
                        modalInstance.hide(); // Properly hide the modal
                    }
                    loadreturnUpdate1B(); // Refresh the data
                } else {
                    alert(response.error || "Failed to update return date.");
                }
            },
            error: function(xhr, status, error) {
                console.error("Error:", error);
                alert("Error while updating return date.");
            }
        });
    };

    return {
        init: function() {
            loadreturnUpdate1B();

            // Event delegation for dynamically added elements
            $('#borrow-box-all-over').on('click', '.confirm-update', function() {
                var updateBookID = $(this).data('id');
                updateReturnDate(updateBookID);
            });
        }
    };
}();




var returnUpdate2 = function() {
    "use strict";

    // Create the HTML structure for a borrowed book
    var createUpdateBox = function(update) {
        return `
         <div class="borrow-record-item">
            <div class="borrow-box-holder">
                <div class="borrow-box pad-ko mt-3 row">
                    <div class="book-img col-lg-4">
                        <button class="book-cover-button borrowed-book-cover" type="button" aria-label="View book cover"><img src="${update.image}" alt=""></button>
                    </div>
                    <div class="book-info col-lg-8 pb-3">
                        <h3 class="mb-3 h-light">${update.title}</h3>
                        <p class="mb-1 for-text">Author: <strong>${update.author}</strong></p>
                        <p class="mb-1 for-text">ID: <span style="color: #8b8c8f;font-weight: 600">${update.bookID}</span></p>
                        <p class="mb-1 for-text">Borrowed: <i style="color: #8b8c8f;font-weight: 500">${update.borrowedDate}</i></p> <!-- Display borrowed date -->
                        <p class="mb-3 for-text">Due date: <i class="h-light">${update.returnDate}</i></p>
                        <button type="button" class="btn btn-success px-4" data-bs-toggle="modal" data-bs-target="#exampleModal-${update.bookID}">Extend</button>

                        <!-- Modal -->
                        <div class="modal" id="exampleModal-${update.bookID}" tabindex="-1" aria-labelledby="exampleModalLabel-${update.bookID}" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h1 class="modal-title fs-5 text-secondary" id="exampleModalLabel-${update.bookID}">Extend Return Date</h1>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <form id="extendForm-${update.bookID}">
                                            <div class="mb-3">
                                                <input type="hidden" name="${update.bookID}" id="${update.bookID}" value="${update.bookID}">
                                                <label for="extendReturn-${update.bookID}" class="col-form-label">Return Date:</label>
                                                <input type="date" class="form-control" id="extendReturn-${update.bookID}" required min="${getCurrentDate()}" max="${getAdd30daysDate()}">
                                            </div>
                                        </form>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="button" class="btn btn-primary confirm-update" data-id="${update.bookID}" data-bs-dismiss="modal">Confirm</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    };

    // Load all borrowed books
    var loadreturnUpdate2 = function() {
        showBorrowLoading('#borrow-box-is', 'Loading borrowed books...');
        $.ajax({
            url: "borrowIS.php",
            method: "GET",
            dataType: "json",
            success: function(response) {
                renderBorrowResults(
                    '#borrow-box-is',
                    response.value,
                    createUpdateBox,
                    'No borrowed books in Information Systems.'
                );
            },
            error: function(xhr, status, error) {
                failBorrowResults('#borrow-box-is', error);
            }
        });
    };

    // Update return date
    var updateReturnDate = function(updateBookID) {
        var newDate = $(`#extendReturn-${updateBookID}`).val();
        if (!newDate) {
            alert("Please select a return date.");
            return;
        }

        $.ajax({
            url: "borrowReturnUpdate.php",
            method: "POST",
            data: { id: updateBookID, returnDate: newDate },
            success: function(response) {
                console.log("Server Response:", response);

                if (response.success) {
                    alert("Return date updated successfully!");
                    let modalElement = document.getElementById(`exampleModal-${updateBookID}`);
                    let modalInstance = bootstrap.Modal.getInstance(modalElement);
                    if (modalInstance) {
                        modalInstance.hide(); // Properly hide the modal
                    }
                    loadreturnUpdate2(); // Refresh the data
                } else {
                    alert(response.error || "Failed to update return date.");
                }
            },
            error: function(xhr, status, error) {
                console.error("Error:", error);
                alert("Error while updating return date.");
            }
        });
    };

    return {
        init: function() {
            loadreturnUpdate2();

            // Event delegation for dynamically added elements
            $('#borrow-box-is').on('click', '.confirm-update', function() {
                var updateBookID = $(this).data('id');
                updateReturnDate(updateBookID);
            });
        }
    };
}();



var returnUpdate3 = function() {
    "use strict";

    // Create the HTML structure for a borrowed book
    var createUpdateBox = function(update) {
        return `
         <div class="borrow-record-item">
            <div class="borrow-box-holder">
                <div class="borrow-box pad-ko mt-3 row">
                    <div class="book-img col-lg-4">
                        <button class="book-cover-button borrowed-book-cover" type="button" aria-label="View book cover"><img src="${update.image}" alt=""></button>
                    </div>
                    <div class="book-info col-lg-8 pb-3">
                        <h3 class="mb-3 h-light">${update.title}</h3>
                        <p class="mb-1 for-text">Author: <strong>${update.author}</strong></p>
                        <p class="mb-1 for-text">ID: <span style="color: #8b8c8f;font-weight: 600">${update.bookID}</span></p>
                        <p class="mb-1 for-text">Borrowed: <i style="color: #8b8c8f;font-weight: 500">${update.borrowedDate}</i></p> <!-- Display borrowed date -->
                        <p class="mb-3 for-text">Due date: <i class="h-light">${update.returnDate}</i></p>
                        <button type="button" class="btn btn-success px-4" data-bs-toggle="modal" data-bs-target="#exampleModal-${update.bookID}">Extend</button>

                        <!-- Modal -->
                        <div class="modal" id="exampleModal-${update.bookID}" tabindex="-1" aria-labelledby="exampleModalLabel-${update.bookID}" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h1 class="modal-title fs-5 text-secondary" id="exampleModalLabel-${update.bookID}">Extend Return Date</h1>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <form id="extendForm-${update.bookID}">
                                            <div class="mb-3">
                                                <input type="hidden" name="${update.bookID}" id="${update.bookID}" value="${update.bookID}">
                                                <label for="extendReturn-${update.bookID}" class="col-form-label">Return Date:</label>
                                                <input type="date" class="form-control" id="extendReturn-${update.bookID}" required min="${getCurrentDate()}" max="${getAdd30daysDate()}">
                                            </div>
                                        </form>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="button" class="btn btn-primary confirm-update" data-id="${update.bookID}" data-bs-dismiss="modal">Confirm</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    };

    // Load all borrowed books
    var loadreturnUpdate3 = function() {
        showBorrowLoading('#borrow-box-psy', 'Loading borrowed books...');
        $.ajax({
            url: "borrowPsy.php",
            method: "GET",
            dataType: "json",
            success: function(response) {
                renderBorrowResults(
                    '#borrow-box-psy',
                    response.value,
                    createUpdateBox,
                    'No borrowed books in Psychology.'
                );
            },
            error: function(xhr, status, error) {
                failBorrowResults('#borrow-box-psy', error);
            }
        });
    };

    // Update return date
    var updateReturnDate = function(updateBookID) {
        var newDate = $(`#extendReturn-${updateBookID}`).val();
        if (!newDate) {
            alert("Please select a return date.");
            return;
        }

        $.ajax({
            url: "borrowReturnUpdate.php",
            method: "POST",
            data: { id: updateBookID, returnDate: newDate },
            success: function(response) {
                console.log("Server Response:", response);

                if (response.success) {
                    alert("Return date updated successfully!");
                    let modalElement = document.getElementById(`exampleModal-${updateBookID}`);
                    let modalInstance = bootstrap.Modal.getInstance(modalElement);
                    if (modalInstance) {
                        modalInstance.hide(); // Properly hide the modal
                    }
                    loadreturnUpdate3(); // Refresh the data
                } else {
                    alert(response.error || "Failed to update return date.");
                }
            },
            error: function(xhr, status, error) {
                console.error("Error:", error);
                alert("Error while updating return date.");
            }
        });
    };

    return {
        init: function() {
            loadreturnUpdate3();

            // Event delegation for dynamically added elements
            $('#borrow-box-psy').on('click', '.confirm-update', function() {
                var updateBookID = $(this).data('id');
                updateReturnDate(updateBookID);
            });
        }
    };
}();



var returnUpdate4 = function() {
    "use strict";

    // Create the HTML structure for a borrowed book
    var createUpdateBox = function(update) {
        return `
         <div class="borrow-record-item">
            <div class="borrow-box-holder">
                <div class="borrow-box pad-ko mt-3 row">
                    <div class="book-img col-lg-4">
                        <button class="book-cover-button borrowed-book-cover" type="button" aria-label="View book cover"><img src="${update.image}" alt=""></button>
                    </div>
                    <div class="book-info col-lg-8 pb-3">
                        <h3 class="mb-3 h-light">${update.title}</h3>
                        <p class="mb-1 for-text">Author: <strong>${update.author}</strong></p>
                        <p class="mb-1 for-text">ID: <span style="color: #8b8c8f;font-weight: 600">${update.bookID}</span></p>
                        <p class="mb-1 for-text">Borrowed: <i style="color: #8b8c8f;font-weight: 500">${update.borrowedDate}</i></p> <!-- Display borrowed date -->
                        <p class="mb-3 for-text">Due date: <i class="h-light">${update.returnDate}</i></p>
                        <button type="button" class="btn btn-success px-4" data-bs-toggle="modal" data-bs-target="#exampleModal-${update.bookID}">Extend</button>

                        <!-- Modal -->
                        <div class="modal" id="exampleModal-${update.bookID}" tabindex="-1" aria-labelledby="exampleModalLabel-${update.bookID}" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h1 class="modal-title fs-5 text-secondary" id="exampleModalLabel-${update.bookID}">Extend Return Date</h1>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <form id="extendForm-${update.bookID}">
                                            <div class="mb-3">
                                                <input type="hidden" name="${update.bookID}" id="${update.bookID}" value="${update.bookID}">
                                                <label for="extendReturn-${update.bookID}" class="col-form-label">Return Date:</label>
                                                <input type="date" class="form-control" id="extendReturn-${update.bookID}" required min="${getCurrentDate()}" max="${getAdd30daysDate()}">
                                            </div>
                                        </form>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="button" class="btn btn-primary confirm-update" data-id="${update.bookID}" data-bs-dismiss="modal">Confirm</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    };

    // Load all borrowed books
    var loadreturnUpdate4 = function() {
        showBorrowLoading('#borrow-box-ce', 'Loading borrowed books...');
        $.ajax({
            url: "borrowCE.php",
            method: "GET",
            dataType: "json",
            success: function(response) {
                renderBorrowResults(
                    '#borrow-box-ce',
                    response.value,
                    createUpdateBox,
                    'No borrowed books in Engineering.'
                );
            },
            error: function(xhr, status, error) {
                failBorrowResults('#borrow-box-ce', error);
            }
        });
    };

    // Update return date
    var updateReturnDate = function(updateBookID) {
        var newDate = $(`#extendReturn-${updateBookID}`).val();
        if (!newDate) {
            alert("Please select a return date.");
            return;
        }

        $.ajax({
            url: "borrowReturnUpdate.php",
            method: "POST",
            data: { id: updateBookID, returnDate: newDate },
            success: function(response) {
                console.log("Server Response:", response);

                if (response.success) {
                    alert("Return date updated successfully!");
                    let modalElement = document.getElementById(`exampleModal-${updateBookID}`);
                    let modalInstance = bootstrap.Modal.getInstance(modalElement);
                    if (modalInstance) {
                        modalInstance.hide(); // Properly hide the modal
                    }
                    loadreturnUpdate4(); // Refresh the data
                } else {
                    alert(response.error || "Failed to update return date.");
                }
            },
            error: function(xhr, status, error) {
                console.error("Error:", error);
                alert("Error while updating return date.");
            }
        });
    };

    return {
        init: function() {
            loadreturnUpdate4();

            // Event delegation for dynamically added elements
            $('#borrow-box-ce').on('click', '.confirm-update', function() {
                var updateBookID = $(this).data('id');
                updateReturnDate(updateBookID);
            });
        }
    };
}();



var returnUpdate5 = function() {
    "use strict";

    // Create the HTML structure for a borrowed book
    var createUpdateBox = function(update) {
        return `
         <div class="borrow-record-item">
            <div class="borrow-box-holder">
                <div class="borrow-box pad-ko mt-3 row">
                    <div class="book-img col-lg-4">
                        <button class="book-cover-button borrowed-book-cover" type="button" aria-label="View book cover"><img src="${update.image}" alt=""></button>
                    </div>
                    <div class="book-info col-lg-8 pb-3">
                        <h3 class="mb-3 h-light">${update.title}</h3>
                        <p class="mb-1 for-text">Author: <strong>${update.author}</strong></p>
                        <p class="mb-1 for-text">ID: <span style="color: #8b8c8f;font-weight: 600">${update.bookID}</span></p>
                        <p class="mb-1 for-text">Borrowed: <i style="color: #8b8c8f;font-weight: 500">${update.borrowedDate}</i></p> <!-- Display borrowed date -->
                        <p class="mb-3 for-text">Due date: <i class="h-light">${update.returnDate}</i></p>
                        <button type="button" class="btn btn-success px-4" data-bs-toggle="modal" data-bs-target="#exampleModal-${update.bookID}">Extend</button>

                        <!-- Modal -->
                        <div class="modal" id="exampleModal-${update.bookID}" tabindex="-1" aria-labelledby="exampleModalLabel-${update.bookID}" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h1 class="modal-title fs-5 text-secondary" id="exampleModalLabel-${update.bookID}">Extend Return Date</h1>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <form id="extendForm-${update.bookID}">
                                            <div class="mb-3">
                                                <input type="hidden" name="${update.bookID}" id="${update.bookID}" value="${update.bookID}">
                                                <label for="extendReturn-${update.bookID}" class="col-form-label">Return Date:</label>
                                                <input type="date" class="form-control" id="extendReturn-${update.bookID}" required min="${getCurrentDate()}" max="${getAdd30daysDate()}">
                                            </div>
                                        </form>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="button" class="btn btn-primary confirm-update" data-id="${update.bookID}" data-bs-dismiss="modal">Confirm</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    };

    // Load all borrowed books
    var loadreturnUpdate5 = function() {
        showBorrowLoading('#borrow-box-ns', 'Loading borrowed books...');
        $.ajax({
            url: "borrowNS.php",
            method: "GET",
            dataType: "json",
            success: function(response) {
                renderBorrowResults(
                    '#borrow-box-ns',
                    response.value,
                    createUpdateBox,
                    'No borrowed books in Nursing.'
                );
            },
            error: function(xhr, status, error) {
                failBorrowResults('#borrow-box-ns', error);
            }
        });
    };

    // Update return date
    var updateReturnDate = function(updateBookID) {
        var newDate = $(`#extendReturn-${updateBookID}`).val();
        if (!newDate) {
            alert("Please select a return date.");
            return;
        }

        $.ajax({
            url: "borrowReturnUpdate.php",
            method: "POST",
            data: { id: updateBookID, returnDate: newDate },
            success: function(response) {
                console.log("Server Response:", response);

                if (response.success) {
                    alert("Return date updated successfully!");
                    let modalElement = document.getElementById(`exampleModal-${updateBookID}`);
                    let modalInstance = bootstrap.Modal.getInstance(modalElement);
                    if (modalInstance) {
                        modalInstance.hide(); // Properly hide the modal
                    }
                    loadreturnUpdate5(); // Refresh the data
                } else {
                    alert(response.error || "Failed to update return date.");
                }
            },
            error: function(xhr, status, error) {
                console.error("Error:", error);
                alert("Error while updating return date.");
            }
        });
    };

    return {
        init: function() {
            loadreturnUpdate5();

            // Event delegation for dynamically added elements
            $('#borrow-box-ns').on('click', '.confirm-update', function() {
                var updateBookID = $(this).data('id');
                updateReturnDate(updateBookID);
            });
        }
    };
}();



var returnUpdate6 = function() {
    "use strict";

    // Create the HTML structure for a borrowed book
    var createUpdateBox = function(update) {
        return `
         <div class="borrow-record-item">
            <div class="borrow-box-holder">
                <div class="borrow-box pad-ko mt-3 row">
                    <div class="book-img col-lg-4">
                        <button class="book-cover-button borrowed-book-cover" type="button" aria-label="View book cover"><img src="${update.image}" alt=""></button>
                    </div>
                    <div class="book-info col-lg-8 pb-3">
                        <h3 class="mb-3 h-light">${update.title}</h3>
                        <p class="mb-1 for-text">Author: <strong>${update.author}</strong></p>
                        <p class="mb-1 for-text">ID: <span style="color: #8b8c8f;font-weight: 600">${update.bookID}</span></p>
                        <p class="mb-1 for-text">Borrowed: <i style="color: #8b8c8f;font-weight: 500">${update.borrowedDate}</i></p> <!-- Display borrowed date -->
                        <p class="mb-3 for-text">Due date: <i class="h-light">${update.returnDate}</i></p>
                        <button type="button" class="btn btn-success px-4" data-bs-toggle="modal" data-bs-target="#exampleModal-${update.bookID}">Extend</button>

                        <!-- Modal -->
                        <div class="modal" id="exampleModal-${update.bookID}" tabindex="-1" aria-labelledby="exampleModalLabel-${update.bookID}" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h1 class="modal-title fs-5 text-secondary" id="exampleModalLabel-${update.bookID}">Extend Return Date</h1>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <form id="extendForm-${update.bookID}">
                                            <div class="mb-3">
                                                <input type="hidden" name="${update.bookID}" id="${update.bookID}" value="${update.bookID}">
                                                <label for="extendReturn-${update.bookID}" class="col-form-label">Return Date:</label>
                                                <input type="date" class="form-control" id="extendReturn-${update.bookID}" required min="${getCurrentDate()}" max="${getAdd30daysDate()}">
                                            </div>
                                        </form>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="button" class="btn btn-primary confirm-update" data-id="${update.bookID}" data-bs-dismiss="modal">Confirm</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    };

    // Load all borrowed books
    var loadreturnUpdate6 = function() {
        showBorrowLoading('#borrow-box-mw', 'Loading borrowed books...');
        $.ajax({
            url: "borrowMW.php",
            method: "GET",
            dataType: "json",
            success: function(response) {
                renderBorrowResults(
                    '#borrow-box-mw',
                    response.value,
                    createUpdateBox,
                    'No borrowed books in Midwifery.'
                );
            },
            error: function(xhr, status, error) {
                failBorrowResults('#borrow-box-mw', error);
            }
        });
    };

    // Update return date
    var updateReturnDate = function(updateBookID) {
        var newDate = $(`#extendReturn-${updateBookID}`).val();
        if (!newDate) {
            alert("Please select a return date.");
            return;
        }

        $.ajax({
            url: "borrowReturnUpdate.php",
            method: "POST",
            data: { id: updateBookID, returnDate: newDate },
            success: function(response) {
                console.log("Server Response:", response);

                if (response.success) {
                    alert("Return date updated successfully!");
                    let modalElement = document.getElementById(`exampleModal-${updateBookID}`);
                    let modalInstance = bootstrap.Modal.getInstance(modalElement);
                    if (modalInstance) {
                        modalInstance.hide(); // Properly hide the modal
                    }
                    loadreturnUpdate6(); // Refresh the data
                } else {
                    alert(response.error || "Failed to update return date.");
                }
            },
            error: function(xhr, status, error) {
                console.error("Error:", error);
                alert("Error while updating return date.");
            }
        });
    };

    return {
        init: function() {
            loadreturnUpdate6();

            // Event delegation for dynamically added elements
            $('#borrow-box-mw').on('click', '.confirm-update', function() {
                var updateBookID = $(this).data('id');
                updateReturnDate(updateBookID);
            });
        }
    };
}();



var returnUpdate7 = function() {
    "use strict";

    // Create the HTML structure for a borrowed book
    var createUpdateBox = function(update) {
        return `
         <div class="borrow-record-item">
            <div class="borrow-box-holder">
                <div class="borrow-box pad-ko mt-3 row">
                    <div class="book-img col-lg-4">
                        <button class="book-cover-button borrowed-book-cover" type="button" aria-label="View book cover"><img src="${update.image}" alt=""></button>
                    </div>
                    <div class="book-info-due  col-lg-8 pb-3">
                        <h3 class="mb-3" style="color: #ee2f25">${update.title}</h3>
                        <p class="mb-1 for-text">Author: <strong>${update.author}</strong></p>
                        <p class="mb-1 for-text">ID: <span style="color: #8b8c8f;font-weight: 600">${update.bookID}</span></p>
                        <p class="mb-1 for-text">Borrowed: <i style="color: #8b8c8f;font-weight: 500">${update.borrowedDate}</i></p> <!-- Display borrowed date -->
                        <p class="mb-3 for-text">Due date: <i style="color: #ee2f25">${update.returnDate}</i></p>
                        <button type="button" class="btn btn-success px-4" data-bs-toggle="modal" data-bs-target="#exampleModal-${update.bookID}">Extend</button>
    
                        <!-- Modal -->
                        <div class="modal" id="exampleModal-${update.bookID}" tabindex="-1" aria-labelledby="exampleModalLabel-${update.bookID}" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h1 class="modal-title fs-5 text-secondary" id="exampleModalLabel-${update.bookID}">Extend Return Date</h1>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <form id="extendForm-${update.bookID}">
                                            <div class="mb-3">
                                                <input type="hidden" name="${update.bookID}" id="${update.bookID}" value="${update.bookID}">
                                                <label for="extendReturn-${update.bookID}" class="col-form-label">Return Date:</label>
                                                <input type="date" class="form-control" id="extendReturn-${update.bookID}" required min="${getCurrentDate()}" max="${getAdd30daysDate()}">
                                            </div>
                                        </form>
                                    </div>
                                    <div class="modal-footer due-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="button" class="btn btn-primary confirm-update" data-id="${update.bookID}" data-bs-dismiss="modal">Confirm</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    };

    // Load all borrowed books
    var loadreturnUpdate7 = function() {
        showBorrowLoading('#borrow-box-over', 'Checking for overdue books...');
        $.ajax({
            url: "borrowOver.php",
            method: "GET",
            dataType: "json",
            success: function(response) {
                renderBorrowResults(
                    '#borrow-box-over',
                    response.value,
                    createUpdateBox,
                    'No overdue books. You are up to date.'
                );
            },
            error: function(xhr, status, error) {
                failBorrowResults('#borrow-box-over', error);
            }
        });
    };

    // Update return date
    var updateReturnDate = function(updateBookID) {
        var newDate = $(`#extendReturn-${updateBookID}`).val();
        if (!newDate) {
            alert("Please select a return date.");
            return;
        }

        $.ajax({
            url: "borrowOverReturn.php",
            method: "POST",
            data: { id: updateBookID, returnDate: newDate },
            success: function(response) {
                console.log("Server Response:", response);

                if (response.success) {
                    alert("Return date updated successfully!");
                    let modalElement = document.getElementById(`exampleModal-${updateBookID}`);
                    let modalInstance = bootstrap.Modal.getInstance(modalElement);
                    if (modalInstance) {
                        modalInstance.hide(); // Properly hide the modal
                    }
                    loadreturnUpdate7(); // Refresh the data
                } else {
                    alert(response.error || "Failed to update return date.");
                }
            },
            error: function(xhr, status, error) {
                console.error("Error:", error);
                alert("Error while updating return date.");
            }
        });
    };

    return {
        init: function() {
            loadreturnUpdate7();

            // Event delegation for dynamically added elements
            $('#borrow-box-over').on('click', '.confirm-update', function() {
                var updateBookID = $(this).data('id');
                updateReturnDate(updateBookID);
            });
        }
    };
}();
